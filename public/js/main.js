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

  M.ScrollSpy.init(document.querySelectorAll('.scrollspy'));

  M.Dropdown.init(document.querySelectorAll('.dropdown-trigger'));

  //ckeditor initialization
  const textAreas = document.querySelectorAll('textarea');
  if (textAreas) {
    textAreas.forEach((textArea) => {
      CKEDITOR.replace(textArea.getAttribute('id').toString(), {
        plugins: 'wysiwygarea, toolbar, basicstyles, link',
      });
    });
  }

  const arrowUp = document.querySelector('.btn-floating');
  arrowUp.addEventListener('click', () => {
    const anchor = document.querySelector('#main-anchor');
    anchor.scrollIntoView({
      behavior: 'smooth',
    });
  });

  const filesInputs = document.querySelectorAll('.file-input');
  filesInputs.forEach((fileInput) => {
    fileInput.addEventListener('change', (e) => {
      const files = e.target.files[0];
      const fileId = fileInput.getAttribute('id').toString();
      const id = fileId.split(`${fileInput.getAttribute('name')}-`)[1];
      const previewDialog = document.querySelector(`#preview-image-${id}`);
      const previewLabel = document.querySelector(`#preview-label-${id}`);
      const previewImageSource = document.querySelector(
        `#preview-image-src-${id}`,
      );
      console.log(
        files,
        fileId,
        id,
        previewDialog,
        previewLabel,
        previewImageSource,
      );
      if (previewDialog) {
        const previewDialogInstance = M.Modal.getInstance(previewDialog);
        previewImageSource.setAttribute('src', URL.createObjectURL(files));
        fileInput.setAttribute('value', files);
        previewLabel.setAttribute('for', fileId);
        previewDialogInstance.open();
      }
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
          { job_flyer, job_id, job_title, job_apply_address, job_salary },
        ) => {
          const option = `${job_title}, ${job_apply_address}, ${
            job_salary ?? '?'
          } XAF`;
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
