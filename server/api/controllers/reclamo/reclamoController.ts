import ReclamoService from '../../services/reclamo.service';
import UsuarioService from '../../services/usuario.service';
import { Request, Response } from 'express';
import { Reclamo } from '../../model/reclamo';
import { ResponseCode } from '../../dtos/response-codes.enum';
import { Usuario } from '../../model/usuario';
import { EstadoReclamo } from '../../model/estadoReclamo';

function canCreate(reclamo) {
  if(reclamo.usuario.idSSO == "" ||
  reclamo.usuario.nombre == "" ||
  reclamo.usuario.email == "" ||
  reclamo.usuario.telefono == "" ||
  reclamo.usuario.direccion == "" ||
  reclamo.usuario.rol == "" ||
  reclamo.descripcion == "" ||
  reclamo.nroOrden == "" ||
  reclamo.fuente == "")
  return false;

  return true;
}

export class ReclamoController {
  /**
   * BuscarReclamo Funcionando
   */
  findOne(req: Request, res: Response): void {
    const id = parseInt(req.params.id);
    console.table(req.param);
    ReclamoService.findOne(id)
      .then(r => {
        if (!r) {
          res.status(ResponseCode.NotFound).end();
        } else {
          console.log(r.getUsuario());
          res.json(r);
        }
      })
      .catch(err => res.status(ResponseCode.InternalServerError).end());
  }

  /**
   * AltaReclamo Funcionando
   */
  save(req: Request, res: Response):void {
    const reclamo = req.body;
    console.table(req.body);

      UsuarioService.findOne(reclamo.email)
      .then(usuario => {
        if (!usuario) {
          res.status(ResponseCode.InternalServerError).json({
            message: `El usuario no existe`
          });
        }
        else{
          let reclamoSave = new Reclamo(
            usuario,
            reclamo.descripcion,
            reclamo.nroOrden,
            'operador',
            new Date(),
            new EstadoReclamo(1, 'Ingresado')
          );

          ReclamoService.save(reclamoSave)
          .then(x => res.json(x))
          .catch(err => {
            console.error(err);
            return res.status(500).json({
              message: `No se ha podido guardar el reclamo`
            });
          });
        }
      })
      .catch(err => {
        return res.status(ResponseCode.InternalServerError).json({
          message: `Un error inesperado a ocurrido. Por favor, reintentelo nuevamente`
       });;
      });
  }


  /**
   * ModificarReclamo Funcionando
   */
  update(req: Request, res: Response): void {
    console.table(req.params);
    console.table(req.body);
    const id = parseInt(req.params.id);
    const reclamo = req.body;
    if(reclamo.descripcion == "" || reclamo.estado <=0 || reclamo.estado >5){
      res.status(500).json({
        message: `No se pudo atualizar el reclamo. Descripcion o estado incorrecto`
      });
    }
    ReclamoService.findOne(id)
      .then(r => {
        if (!r) {
          res.status(ResponseCode.NotFound).end();
        } else {

          r.setDescripcion(reclamo.descripcion);
          r.getEstado().setId(reclamo.estado);
          ReclamoService.update(id, r).then(r2 => {
            if (!r2) return res.status(ResponseCode.NotFound).end();
            return res.status(ResponseCode.Ok).end();
          });
        }
      })
  }

  /**
   * BajaReclamo Funcionando
   */
  remove(req: Request, res: Response): void {
    console.table(req.params);
    console.table(req.body);

    const id = parseInt(req.params.id);
    ReclamoService.remove(id)
      .then(r => {
        if (!r) return res.status(ResponseCode.NotFound).end();
        res.json(r);
      })
      .catch(err => res.status(ResponseCode.InternalServerError).end());
  }

  /**
   * GetReclamos Funcionando
   */
  getAll(req: Request, res: Response): void {
    ReclamoService.getAll()
      .then(r => res.json(r))
      .catch(err => res.status(ResponseCode.InternalServerError).end());
  }
}

export default new ReclamoController();