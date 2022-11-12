document.addEventListener('DOMContentLoaded', function () {
  const e = React.createElement;

  const jobsContainer = document.querySelector('#jobs-root');
  if (jobsContainer) {
    const Jobs = () => {
      const [jobs, setJobs] = React.useState([]);
      const [selectedArea, setSelectedArea] = React.useState(); //TODO
      const [selectedLocation, setSelectedLocation] = React.useState(); //TODO
      const [selectedTag, setSelectedTag] = React.useState(); //TODO

      const refreshJobs = () => {
        fetch(
          `/jobs?area_id=${selectedArea}&location_id=${selectedLocation}&tag_id=${selectedTag}`,
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          },
        )
          .then(async (response) => {
            const { jobs } = await response.json();
            setJobs(jobs);
          })
          .catch((error) => {
            console.log(error);
          });
      };

      React.useEffect(() => {
        refreshJobs();
      }, [selectedArea]);

      return React.createElement(
        'div',
        {
          id: 'jobs-container',
          className: 'row',
        },
        React.createElement(
          React.Fragment,
          null,
          jobs.map(function (_ref, index) {
            var job_id = _ref.job_id,
              areas = _ref.jobAreas,
              tags = _ref.jobTags,
              locations = _ref.jobLocations,
              posted_at = _ref.posted_at,
              job_title = _ref.job_title,
              job_salary = _ref.job_salary,
              employer = _ref.employer,
              job_description = _ref.job_description;
            return React.createElement(
              'div',
              {
                key: index,
                className: 'col s12 m4',
              },
              /*#__PURE__*/ React.createElement(
                'div',
                {
                  className: 'card',
                },
                /*#__PURE__*/ React.createElement(
                  'div',
                  {
                    className: 'card-content',
                    style: { display: 'grid', gap: '10px' },
                  },
                  /*#__PURE__*/ React.createElement(
                    'div',
                    {
                      className: 'card-title',
                    },

                    React.createElement(
                      'div',
                      {
                        style: {
                          display: 'grid',
                          gridTemplateColumn: '1fr auto',
                        },
                      },
                      React.createElement(
                        'div',
                        null,
                        areas.map(function (_ref, index) {
                          var area_id = _ref.area_id,
                            area_name = _ref.area_name;
                          return /*#__PURE__*/ React.createElement(
                            'p',
                            {
                              key: index,
                              style: {
                                display: 'inline-block',
                                margin: '5px',
                              },
                            },
                            /*#__PURE__*/ React.createElement(
                              'a',
                              {
                                id: area_id,
                                className: 'tag-button tag',
                                style: {
                                  backgroundColor: 'whitesmoke',
                                },
                              },
                              area_name,
                            ),
                          );
                        }),
                      ),
                      React.createElement(
                        'div',
                        null,
                        tags.map(({ tag_id, tag_name }) =>
                          React.createElement(
                            'span',
                            {
                              key: tag_id,
                              className: 'new badge',
                              'data-badge-caption': '',
                            },
                            tag_name,
                          ),
                        ),
                      ),
                    ),
                    /*#__PURE__*/ React.createElement(
                      'div',
                      {},
                      /*#__PURE__*/ React.createElement(
                        'h4',
                        {
                          style: { fontWeight: 600 },
                        },
                        /*#__PURE__*/ React.createElement(
                          'a',
                          {
                            href: '/jobs/'.concat(job_id),
                          },
                          job_title,
                        ),
                      ),
                    ),
                  ),
                  /*#__PURE__*/ React.createElement(
                    'div',
                    { style: { display: 'grid', gap: '10px' } },
                    /*#__PURE__*/ React.createElement(
                      'p',
                      null,
                      job_description,
                    ),
                    /*#__PURE__*/ React.createElement(
                      'p',
                      /*#__PURE__*/ React.createElement(
                        'i',
                        {
                          className: 'material-icons left',
                          style: { margin: 0 },
                        },
                        'location_on',
                      ),
                      locations.map(({ town: location }) => `${location}, `),
                    ),
                    /*#__PURE__*/ React.createElement(
                      'p',
                      null,
                      job_salary
                        ? /*#__PURE__*/ React.createElement(
                            'i',
                            {
                              className: 'material-icons left',
                              style: {
                                margin: 0,
                              },
                            },
                            'attach_money',
                          )
                        : null,
                      job_salary,
                    ),
                  ),
                  /*#__PURE__*/
                  React.createElement(
                    'div',
                    {
                      className: 'grid-1fr-auto',
                    },
                    /*#__PURE__*/ React.createElement(
                      'a',
                      {
                        href: employer.employer_linkedin,
                        style: { display: 'flex', alignItems: 'center' },
                      },
                      employer.logo_ref
                        ? /*#__PURE__*/ React.createElement('img', {
                            width: '50',
                            height: '50',
                            src: `/images/${employer.logo_ref}`,
                            alt: 'logo ref',
                          })
                        : null,
                      employer.employer_name,
                    ),
                    /*#__PURE__*/ React.createElement('p', null, posted_at),
                  ),
                ),
              ),
            );
          }),
        ),
      );
    };
    const root = ReactDOM.createRoot(jobsContainer);
    root.render(e(Jobs));
  }
  const jobOptions = document.querySelector('#jobs-area');
  if (jobOptions) {
    const OptionalArea = ({ handleChoise }) => {
      const [areas, setAreas] = React.useState([]);
      React.useEffect(() => {
        fetch('/areas', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })
          .then(async (response) => {
            const { areas } = await response.json();
            setAreas(areas);
          })
          .catch((error) => {
            console.log(error);
          });
      }, []);
      return React.createElement(
        React.Fragment,
        null,
        areas.map(function (_ref, index) {
          var area_id = _ref.area_id,
            area_name = _ref.area_name;
          return /*#__PURE__*/ React.createElement(
            'button',
            {
              key: area_id,
              value: area_id,
              className: 'tag-button',
              onClick: (e) => handleChoise(e.target.value),
            },
            area_name,
          );
        }),
      );
    };

    const root = ReactDOM.createRoot(jobOptions);
    root.render(e(OptionalArea));
  }
});
