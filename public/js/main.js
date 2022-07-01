document.addEventListener('DOMContentLoaded', function () {
  // materialize initialization
  M.Sidenav.init(document.querySelector('.sidenav'));

  M.FormSelect.init(document.querySelectorAll('select'));

  M.Carousel.init(document.querySelector('.carousel'));

  M.Collapsible.init(document.querySelector('.collapsible'));

  M.Modal.init(document.querySelectorAll('.modal'));

  M.Tabs.init(document.querySelectorAll('.tabs'));

  M.Autocomplete.init(document.querySelector('.autocomplete'));

  M.Datepicker.init(document.querySelectorAll('.datepicker'));

  M.ScrollSpy.init(document.querySelectorAll('.scrollspy'))

  const arrowUp = document.querySelector('.btn-floating');
  arrowUp.addEventListener('click', () => {
    const anchor = document.querySelector('#main-anchor');
    anchor.scrollIntoView({
      behavior: 'smooth',
    });
  });

  //search dialog initialization
  let jobRefs = [];
  const searchElt = document.querySelector('.autocomplete');
  let searchInstance = M.Autocomplete.getInstance(searchElt);
  
  fetch('/jobs', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })
    .then(async (response) => {
      const { jobs } = await response.json();
      const data = jobs.reduce(
        (
          newObject,
          { job_flyer, job_id, job_title, job_apply_address,  job_salary },
        ) => {
          const option = `${job_title}, ${job_apply_address}, ${job_salary ?? '?'} XAF`;
          newObject[option] = `/images/${job_flyer}`;
          jobRefs.push({ job_id, option });
          return newObject;
        },
        {},
      );
      searchInstance.updateData(data);
    })
    .catch((error) => {
      console.log(error.message);
    });
    
    if (searchInstance)
    searchInstance.options = {
      ...searchInstance?.options,
      onAutocomplete: (e) => {
        const { job_id } = jobRefs.find(({ option }) => option === e);
        location.href = `/jobs/${job_id}`;
      },
    };
});
