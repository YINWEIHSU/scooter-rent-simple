import { Test, TestingModule } from '@nestjs/testing'
import { Repository } from 'typeorm'
import { ScootersService } from './scooters.service'
import { Scooter } from './scooter.entity'
import { getRepositoryToken } from '@nestjs/typeorm'

describe('ScootersService', () => {
  let service: ScootersService
  let fakeRepository: Partial<Record<keyof Repository<Scooter>, jest.Mock>>

  beforeEach(async () => {
    fakeRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      remove: jest.fn(),
      find: jest.fn()
    }
    
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScootersService,
        {
          provide: getRepositoryToken(Scooter),
          useValue: fakeRepository
        }
      ]
    }).compile()

    service = module.get(ScootersService)
  })

  it('can create a scooter service instance', () => {
    expect(service).toBeDefined()
  })

  it('should successfully create a scooter', async () => {
    const name = 'TestScooter'
    fakeRepository.create.mockReturnValue({ name })
    await service.create(name)

    expect(fakeRepository.create).toHaveBeenCalledWith({ name })
    expect(fakeRepository.save).toHaveBeenCalled()
  })

  it('should update scooter if found', async () => {
    const scooterId = 1
    const scooterUpdate = { name: 'UpdatedScooter' }
    const existingScooter = { id: scooterId, name: 'OldName' }
    fakeRepository.findOne.mockResolvedValue(existingScooter)
    await service.update(scooterId, scooterUpdate)

    expect(fakeRepository.save).toHaveBeenCalledWith({ ...existingScooter, ...scooterUpdate })
  })

  it('should return null if scooter not found', async () => {
    const scooterId = 1
    fakeRepository.findOne.mockResolvedValue(null)
    const result = await service.update(scooterId, {})

    expect(result).toBeNull()
  })

  it('should remove a scooter', async () => {
    const scooterId = 1
    const existingScooter = { id: scooterId, name: 'TestScooter' }
    fakeRepository.findOne.mockResolvedValue(existingScooter)
    await service.remove(scooterId)

    expect(fakeRepository.remove).toHaveBeenCalledWith(existingScooter)
  })

  it('should return all scooters', async () => {
    const scooters = [{ id: 1, name: 'Scooter01' }, { id: 2, name: 'Scooter02' }]
    fakeRepository.find.mockResolvedValue(scooters)
    const result = await service.findAll()

    expect(result).toEqual(scooters)
  })

  it('should return a scooter by ID', async () => {
    const scooterId = 1
    const scooter = { id: scooterId, name: 'TestScooter' }
    fakeRepository.findOne.mockResolvedValue(scooter)
    const result = await service.findOneById(scooterId)

    expect(result).toEqual(scooter)
  })

  it('should return null if no ID is provided', async () => {
    const result = await service.findOneById(null)

    expect(result).toBeNull()
  })
})
