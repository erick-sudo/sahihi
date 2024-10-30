import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateLeadDto } from 'src/leads/dto/update-lead.dto';
import { CreateLeadDto } from 'src/leads/dto/create-lead.dto';
import { FilterParams } from 'src/lib/definitions';

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCustomerDto: CreateCustomerDto) {
    await this.prisma.customer.create({
      data: createCustomerDto,
    });
    return { message: 'New customer added successfully.' };
  }

  async findAll() {
    return await this.prisma.customer.findMany();
  }

  async findOne(id: string) {
    return await this.ensureExistsById(id);
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto) {
    await this.ensureExistsById(id);
    return await this.prisma.customer.update({
      where: { id },
      data: updateCustomerDto,
    });
  }

  async remove(id: string) {
    await this.prisma.customer.delete({
      where: { id },
    });
    return;
  }

  async searchCustomers(searchParams: FilterParams) {
    const q = searchParams.q;

    return await this.prisma.customer.findMany({
      where: {
        OR: [
          {
            name: {
              contains: q,
            },
          },
          {
            email: {
              contains: q,
            },
          },
          {
            phone: {
              contains: q,
            },
          },
          {
            company: {
              contains: q,
            },
          },
        ],
      },
    });
  }

  async createLead(createLeadDto: CreateLeadDto) {
    await this.prisma.lead.create({
      data: createLeadDto,
    });
    return { message: 'New lead created for this customer.' };
  }

  async findOneLead(id: string) {
    return await this.ensureLeadExistsById(id);
  }

  async findCustomerLeads(id: string) {
    return await this.prisma.lead.findMany({
      where: {
        customerId: id,
      },
    });
  }

  async updateLead(id: string, updateLeadDto: UpdateLeadDto) {
    await this.ensureLeadExistsById(id);
    return await this.prisma.lead.update({
      where: { id },
      data: updateLeadDto,
    });
  }

  async removeLead(id: string) {
    await this.prisma.lead.delete({
      where: { id },
    });
    return;
  }

  async ensureExistsById(id: string) {
    return await this.prisma.customer.findUniqueOrThrow({
      where: { id: id },
    });
  }

  async ensureLeadExistsById(id: string) {
    return await this.prisma.lead.findUniqueOrThrow({
      where: { id: id },
    });
  }
}
