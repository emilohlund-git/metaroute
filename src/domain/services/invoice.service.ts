import { CodeFirstService } from "@core/code-first/services/code-first.service";
import { Injectable } from "@core/common/decorators/injectable.decorator";
import { Invoice } from "../entities/invoice.entity";
import { InvoiceRepository } from "src/infrastructure/repositories/invoice.repository";

@Injectable
export class InvoiceService extends CodeFirstService<Invoice> {
  constructor(protected readonly invoiceRepository: InvoiceRepository) {
    super(invoiceRepository);
  }
}
