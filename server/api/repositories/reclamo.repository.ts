import { Reclamo } from '../model/reclamo';
import { promises } from 'fs';
import { EntityRepository, AbstractRepository } from 'typeorm';

    @EntityRepository(Reclamo)
    export class ReclamoRepository extends AbstractRepository<Reclamo> {
    constructor(){
        super();
    }
    
    update = (id: number, reclamo: Reclamo): Promise<Reclamo> => {
        return this.repository.findOne(id)
            .then(r => {
                if (!r) return;
                const updateEntity = {
                    ...r,
                    ...reclamo,
                    id: r.id
                }
                return this.repository.save(updateEntity);
            })
    }

    save = (reclamo: Reclamo): Promise<Reclamo> => {
        return this.repository.save(reclamo);
    } 

    remove = (id:number): Promise<Reclamo> => {
        return this.repository.findOne(id)
        .then(r =>{
            if(!r)return;

            return this.repository.remove(r);
        })
    }

    findOne = (id: number): Promise<Reclamo> => {
        return this.repository.findOne({where: { id: id }, relations: ["estado", "usuario"]});
    }

    findOneByOrden = (id: number): Promise<Reclamo[]> => {
        return this.repository.find({where: { nroOrden: id }, relations: ["estado", "usuario"]});
    } 

    findAll = (): Promise<Array<Reclamo>> => {
        return this.repository.find({order: {id: 'DESC' }, relations: ["estado", "usuario"]});
    }

    findByNroOrden = (nroOrden: number): Promise<Reclamo> => {
        return this.repository.findOne({where: { nroOrden: nroOrden }, relations: ["estado", "usuario"]});
    }
}
