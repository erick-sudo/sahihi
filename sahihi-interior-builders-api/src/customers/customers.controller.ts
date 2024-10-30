import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { UpdateLeadDto } from 'src/leads/dto/update-lead.dto';
import { CreateLeadDto } from 'src/leads/dto/create-lead.dto';
import { FilterParams } from 'src/lib/definitions';

@Controller()
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post('customers/filters/search')
  searchCustomers(@Body() searchParams: FilterParams) {
    return this.customersService.searchCustomers(searchParams);
  }

  @Post('customers')
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }

  @Get('customers')
  findAll() {
    return this.customersService.findAll();
  }

  @Get('customers/:id')
  findOne(@Param('id') id: string) {
    return this.customersService.findOne(id);
  }

  @Patch('customers/:id')
  update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customersService.update(id, updateCustomerDto);
  }

  @Delete('customers/:id')
  remove(@Param('id') id: string) {
    return this.customersService.remove(id);
  }

  @Get('customers/:id/leads')
  findCustomerLeads(@Param('id') id: string) {
    return this.customersService.findCustomerLeads(id);
  }

  @Post('leads')
  createLead(@Body() createLeadDto: CreateLeadDto) {
    return this.customersService.createLead(createLeadDto);
  }

  @Get('leads/:id')
  findOneLead(@Param('id') id: string) {
    return this.customersService.findOneLead(id);
  }

  @Patch('leads/:id')
  updateLead(@Param('id') id: string, @Body() updateLeadDto: UpdateLeadDto) {
    return this.customersService.updateLead(id, updateLeadDto);
  }

  @Delete('leads/:id')
  removeLead(@Param('id') id: string) {
    return this.customersService.removeLead(id);
  }
}
