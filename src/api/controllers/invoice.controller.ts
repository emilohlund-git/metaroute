import { Body } from "@core/api/decorators/body.decorator";
import { Controller } from "@core/api/decorators/controller.decorator";
import {
  Delete,
  Get,
  Post,
  Put,
} from "@core/api/decorators/handlers.decorator";
import { Param } from "@core/api/decorators/param.decorator";
import { ResponseEntity } from "@core/api/entities/response.entity";
import { Validate } from "@core/validation/guards/validator.guard";
import { ParseIntPipe } from "@core/api/pipes/parse-int.pipe";
import { MetaResponse } from "@core/api/types";
import { Auth } from "@core/auth/guards/auth.guard";
import { Cache } from "@core/cache/decorators/cache.decorator";
import { Invoice } from "src/domain/entities/invoice.entity";
import { InvoiceService } from "src/domain/services/invoice.service";

@Controller("/invoices")
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post("/")
  @Auth()
  @Validate(Invoice)
  async createInvoice(
    @Body() invoice: Invoice
  ): MetaResponse<Invoice | undefined> {
    try {
      const savedInvoice = await this.invoiceService.save(invoice);

      return ResponseEntity.ok(savedInvoice);
    } catch (error) {
      return ResponseEntity.badRequest({
        message: "Failed to create invoice",
        error,
        success: false,
      });
    }
  }

  @Delete("/:id")
  @Auth()
  async deleteInvoice(
    @Param("id", ParseIntPipe) id: number
  ): MetaResponse<boolean> {
    try {
      const response = await this.invoiceService.remove(id);

      return ResponseEntity.ok(response);
    } catch (error) {
      return ResponseEntity.badRequest({
        message: "Failed to delete invoice",
        error,
        success: false,
      });
    }
  }

  @Put("/:id")
  @Auth()
  async updateInvoice(
    @Param("id", ParseIntPipe) id: number,
    @Body() invoice: Invoice
  ): MetaResponse<Invoice | undefined> {
    const updatedInvoice = await this.invoiceService.update(invoice, id);

    return ResponseEntity.ok(updatedInvoice);
  }

  @Get("/")
  @Cache({ ttl: 60 })
  @Auth()
  async getInvoices(): MetaResponse<Invoice[] | undefined> {
    const invoices = await this.invoiceService.findAll();

    return ResponseEntity.ok(invoices);
  }

  @Get("/:id")
  @Auth()
  async getInvoiceById(
    @Param("id", ParseIntPipe) id: number
  ): MetaResponse<Invoice | undefined> {
    const invoice = await this.invoiceService.find({ id: id });

    return ResponseEntity.ok(invoice);
  }
}
