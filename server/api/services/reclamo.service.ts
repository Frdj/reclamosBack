import { Reclamo } from '../model/reclamo';
import { ReclamoRepository } from '../repositories/reclamo.repository';
import { getCustomRepository, UpdateResult } from 'typeorm'; 

export class ReclamoService {
    save(reclamo: Reclamo) : Promise<Reclamo>{
        return getCustomRepository(ReclamoRepository).save(reclamo);
    } 

    update(id : number , reclamo : Reclamo) : Promise<Reclamo>{
        return getCustomRepository(ReclamoRepository).update(id, reclamo);
    }

    remove(id: number) : Promise<Reclamo>{
        return getCustomRepository(ReclamoRepository).remove(id);
    }

    findOne(id: number) : Promise<Reclamo> {
        return getCustomRepository(ReclamoRepository).findOne(id);
    }

    getAll() : Promise<Array<Reclamo>> {
        return getCustomRepository(ReclamoRepository).findAll();
    } 
} 

export default new ReclamoService();