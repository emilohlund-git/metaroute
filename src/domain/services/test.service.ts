import { Injectable } from "@core/common/decorators/injectable.decorator";

@Injectable
export class TestService {
    constructor() {}
    
    test() {
        return "test";
    }
}