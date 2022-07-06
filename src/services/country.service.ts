import { InjectModel } from '@nestjs/sequelize';
import { randomUUID } from 'crypto';
import { Country, CountryCreationAttributes } from 'src/models/country';

export class CountryService {
  constructor(
    @InjectModel(Country)
    private countryModel: typeof Country,
  ) {}

  async findAll(): Promise<Country[]> {
    return this.countryModel.findAll();
  }

  async findOne(country_id: string): Promise<Country> {
    return this.countryModel.findByPk(country_id);
  }

  async create(newCountry: CountryCreationAttributes) {
    return this.countryModel.create({
      ...newCountry,
      country_id: randomUUID(),
    });
  }

  async delete(country_id: string) {
    return this.countryModel.destroy({ where: { country_id } });
  }
}
