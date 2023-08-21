import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Scooter System', () => {
  let app: INestApplication;
  let adminCookie: string[];
  let userCookie: string[];

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

    const userRes = await request(app.getHttpServer())
      .post('/users/signup')
      .send({
        email: 'test01@example.com',
        password: '12345678'
      });
    userCookie = userRes.get('Set-Cookie');

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

  it('can get all scooters', async () => {
    const res = await request(app.getHttpServer())
      .get('/scooters')
      .set('Cookie', userCookie)
      .expect(200);

    const { body } = res;

    expect(body.length).toEqual(2);
  });

  it('can find specific scooter', async () => {
    const id = 1

    const res = await request(app.getHttpServer())
      .get(`/scooters/${id}`)
      .set('Cookie', userCookie)
      .expect(200);

    const { id: returnId, name  } = res.body;
    expect(returnId).toEqual(id);
    expect(name).toBeDefined();
  });
});
