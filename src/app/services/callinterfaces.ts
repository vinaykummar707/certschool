export interface calls {
        getAll(schoolId: string): any;
        create(body:any): any;
        getOne(id: string): any;
        deleteOne(id: string): any;
        updateOne(body: any): any;
}
