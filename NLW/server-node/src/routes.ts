import express from 'express';

import PointsController from './controllers/pointsController';
import ItemsController from './controllers/itemsController';

const routes = express.Router();
const pointsController = new PointsController();
const itemsController = new ItemsController();

routes.get('/items',itemsController.index);
routes.post('/points', pointsController.create);
routes.get('/points/', pointsController.index);
routes.get('/points/:id', pointsController.show);

//index - Listagem
//Show - Listagem Registro Unico
//Create - Update - Delete

export default routes;

//#region comments code
//Rota: Endereço completo da nossa aplicação
//Recurso: Qual entidade estamos acessando

// GET :  BUSCAR UMA OU MAIS INFORMAÇÕES DO BACKEND
// POST: CRIAR UMA NOVA INFORMAÇÃO NO BACKEND
// PUT : ATUALIZAR UMA INFORMAÇÃO EXISTENTE NO BACKEND
// DELETE: REMOVER UMA INFORMAÇÃO DO BACKEND

// Request Param: Parametros que vem na propria rota e identificam um recurso
// Query Param: Parametros que vem na rota geralmente opcionais para filtros, paginação
// Request Body: Parametros para criação e atualização
//#endregion
