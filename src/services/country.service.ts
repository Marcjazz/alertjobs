import { InjectModel } from "@nestjs/sequelize";
import { Country } from "src/models/country";

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
}
