import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from './../src/app.module'

describe('Admin System', () => {
  let app: INestApplication
  let adminCookie: string[]
  let userCookie: string[]

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()

    const adminRes = await request(app.getHttpServer())
      .post('/users/signup')
      .send({
        email: 'admin01@example.com',
        password: '12345678',
        role: 'admin'
      })
    adminCookie = adminRes.get('Set-Cookie')

    const userRes = await request(app.getHttpServer())
      .post('/users/signup')
      .send({
        email: 'test01@example.com',
        password: '12345678'
      })
    userCookie = userRes.get('Set-Cookie')
  })

  it('create a scooter with admin role', async () => {
    const name = 'scooter01'

    const res = await request(app.getHttpServer())
      .post('/admins/scooter')
      .set('Cookie', adminCookie)
      .send({
        name
      })
      .expect(201)

    const { id, name: returnedName, status } = res.body

    expect(id).toBeDefined()
    expect(returnedName).toEqual(name)
    expect(status).toEqual('available')
  })

  it('create a scooter with user role', async () => {
    const name = 'scooter01'
  
    await request(app.getHttpServer())
      .post('/admins/scooter')
      .set('Cookie', userCookie)
      .send({
        name
      })
      .expect(403)
  })

  it('create a scooter and update with admin role', async () => {
    const name = 'scooter01'
    const newName = 'scooter02'

    const createRes = await request(app.getHttpServer())
      .post('/admins/scooter')
      .set('Cookie', adminCookie)
      .send({
        name
      })

    const { id } = createRes.body

    const res = await request(app.getHttpServer())
      .patch(`/admins/scooter/${id}`)
      .set('Cookie', adminCookie)
      .send({
        name: newName
      })
      .expect(200)

    const { id: returnedId, name: returnedName } = res.body

    expect(returnedId).toBeDefined()
    expect(returnedName).toEqual(newName)
  })

  it('create a scooter with admin and update with user role', async () => {
    const name = 'scooter01'
    const newName = 'scooter02'

    const createRes = await request(app.getHttpServer())
      .post('/admins/scooter')
      .set('Cookie', adminCookie)
      .send({
        name
      })

    const { id } = createRes.body

    await request(app.getHttpServer())
      .patch(`/admins/scooter/${id}`)
      .set('Cookie', userCookie)
      .send({
        name: newName
      })
      .expect(403)
  })

  it('find all users with admin role', async () => {
    const res = await request(app.getHttpServer())
      .get('/admins/users')
      .set('Cookie', adminCookie)
      .expect(200)

    const users = res.body
    expect(users.length).toEqual(2)
  })

  it('find all users with user role', async () => {
    await request(app.getHttpServer())
      .get('/admins/users')
      .set('Cookie', userCookie)
      .expect(403)
  })
})
