import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { CountryService } from './services/country.service';
import { LocastionService } from './services/location.service';
import { TagService } from './services/tag.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private locationService: LocastionService,
    private countryService: CountryService,
    private tagService: TagService,
  ) {}

  @Get()
  @Render('index')
  async root() {
    const countries = await this.countryService.findAll();
    const locations = await this.locationService.findAll();
    const tags = await this.tagService.findAll();
    return {
      tags: tags.map((tag) => tag.toJSON()),
      countries: countries.map(({ country_id, country_name }) => {
        return {
          country_name,
          locations: locations
            .filter(({ country_id: id }) => id === country_id)
            .map((location) => location.toJSON()),
        };
      }),
    };
  }
}
