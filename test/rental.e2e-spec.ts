import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Scooter System', () => {
  let app: INestApplication;
  let adminCookie: string[];
  let secondUserCookie: string[];
  let thirdUserCookie: string[];

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const adminRes = await request(app.getHttpServer())
      .post('/users/signup')
      .send({
        email: 'admin01@example.com',
        password: '12345678',
        role: 'admin'
      });
    adminCookie = adminRes.get('Set-Cookie');

    const secondUserRes = await request(app.getHttpServer())
      .post('/users/signup')
      .send({
        email: 'test01@example.com',
        password: '12345678'
      });
    secondUserCookie = secondUserRes.get('Set-Cookie');

    const thirdUserRes = await request(app.getHttpServer())
      .post('/users/signup')
      .send({
        email: 'test02@example.com',
        password: '12345678'
      });
    thirdUserCookie = thirdUserRes.get('Set-Cookie');

    await request(app.getHttpServer())
      .post('/admins/scooter')
      .set('Cookie', adminCookie)
      .send({
        name: 'scooter01'
      });
    await request(app.getHttpServer())
      .post('/admins/scooter')
      .set('Cookie', adminCookie)
      .send({
        name: 'scooter02'
      });
  });

  it('can create rental', async () => {
    const res = await request(app.getHttpServer())
      .post('/rentals')
      .set('Cookie', secondUserCookie)
      .send({
        scooterId: 1
      })
      .expect(201);

    const { id, startTime, endTime, user, scooter } = res.body;

    expect(id).toBeDefined();
    expect(startTime).toBeDefined();
    expect(endTime).toBeNull();
    expect(user.id).toEqual(2);
    expect(scooter.id).toEqual(1);
  });

  it('cannot create rental when currently renting one', async () => {
    await request(app.getHttpServer())
      .post('/rentals')
      .set('Cookie', secondUserCookie)
      .send({
        scooterId: 1
      });

    await request(app.getHttpServer())
      .post('/rentals')
      .set('Cookie', secondUserCookie)
      .send({
        scooterId: 2
      })
      .expect(400);
  });

  it('cannot create rental when scooter is rented', async () => {
    await request(app.getHttpServer())
      .post('/rentals')
      .set('Cookie', secondUserCookie)
      .send({
        scooterId: 1
      });

    await request(app.getHttpServer())
      .post('/rentals')
      .set('Cookie', thirdUserCookie)
      .send({
        scooterId: 1
      })
      .expect(400);
  });

  it('can end rental', async () => {
    await request(app.getHttpServer())
      .post('/rentals')
      .set('Cookie', secondUserCookie)
      .send({
        scooterId: 1
      });

    const res = await request(app.getHttpServer())
      .patch('/rentals/1')
      .set('Cookie', secondUserCookie)
      .expect(200);

    const { id, startTime, endTime} = res.body;

    expect(id).toBeDefined();
    expect(startTime).toBeDefined();
    expect(endTime).toBeDefined();
    expect(new Date(endTime).getTime() - new Date(startTime).getTime()).toBeGreaterThan(0);
  });
});
