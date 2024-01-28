import { Router } from "express";
import { AppRoute } from "../app-route";
import { GenericSearchService } from "../services";




export class GenericSearchController implements AppRoute {
    route = "/generic_search";
    router: Router = Router();


    constructor() {
        this.router.post("/searchFor", this.searchFor);
    }

    private async searchFor(req: any, res: any) {
        const {searchText} = req.body
        const gs = new GenericSearchService();
        const a = await gs.genericSearch(searchText)

        res.json(a)
       
    }    
}
