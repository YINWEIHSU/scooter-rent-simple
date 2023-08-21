import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from './../src/app.module'

describe('Authentication System', () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  it('handles a signup request', async () => {
    const email = 'test01@example.com'

    const res = await request(app.getHttpServer())
    .post('/users/signup')
    .send({
      email,
      password: '12345678'
    })
    .expect(201)

    const { id, email: returnedEmail, role } = res.body

    expect(id).toBeDefined()
    expect(returnedEmail).toEqual(email)
    expect(role).toEqual('user')
  })

  it('signup new user with exists email', async () => {
    const email = 'test01@example.com'

    await request(app.getHttpServer())
      .post('/users/signup')
      .send({
        email,
        password: '12345678'
      })

    await request(app.getHttpServer())
      .post('/users/signup')
      .send({
        email,
        password: '12345678'
      })
      .expect(400)
  })

  it('signup as a new user then signin the user', async () => {
    const email = 'test01@example.com'

    await request(app.getHttpServer())
      .post('/users/signup')
      .send({
        email,
        password: '12345678'
      })
      .expect(201)

    await request(app.getHttpServer())
      .post('/users/signin')
      .send({
        email,
        password: '12345678'
      })
      .expect(200)
  })

  it('signup as a new user then signin the user with wrong password', async () => {
    const email = 'test01@example.com'

    await request(app.getHttpServer())
      .post('/users/signup')
      .send({
        email,
        password: '12345678'
      })
      .expect(201)

    await request(app.getHttpServer())
      .post('/users/signin')
      .send({
        email,
        password: 'wrongpassword'
      })
      .expect(400)
  })

  it('signin the user with wrong email', async () => {
    const email = 'test01@example.com'

    await request(app.getHttpServer())
      .post('/users/signin')
      .send({
        email,
        password: '12345678'
      })
      .expect(400)
    })

  it('signup as a new user then signout the user', async () => {
    const email = 'test01@example.com'

    const singupRes = await request(app.getHttpServer())
      .post('/users/signup')
      .send({
        email,
        password: '12345678'
      })
      .expect(201)

    const signupCookie = singupRes.get('Set-Cookie')

    await request(app.getHttpServer())
      .get('/users/1')
      .set('Cookie', signupCookie)
      .expect(200)

    const signoutRes = await request(app.getHttpServer())
      .post('/users/signout')
      .expect(200)

    const signoutCookie = signoutRes.get('Set-Cookie')
  
    await request(app.getHttpServer())
      .get('/users/1')
      .set('Cookie', signoutCookie)
      .expect(403)
  })
})
