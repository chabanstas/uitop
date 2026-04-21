import { faker } from '@faker-js/faker';
import { test } from '@playwright/test';
import { CreateCustomProject } from 'e2e/pages/CreateCustomProject';
import { Home } from 'e2e/pages/Home';
import { Projects } from 'e2e/pages/Projects';
import { loginViaApi } from 'e2e/utils/auth';

test.describe('Projects', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ page }) => {
    await loginViaApi(page);
  });

  test('Create Custom Project', async ({ page }) => {
    const jurisdiction = 'La';
    const name = faker.lorem.words(3);
    const address = 'Testo, South Carolina, United States';
    const unitNumber = 123;
    const status = 'Draft';
    let projectId: string;

    await new Home(page).visit().then(async (homePage) => {
      await homePage.navBar.projectsAnchor.click();
    });
    await new Projects(page).createCustomProjectButton.click();
    await new CreateCustomProject(page).inside(
      async (createCustomProjectPage) => {
        await createCustomProjectPage.selectJurisdiction(jurisdiction);
        await createCustomProjectPage.nameInput.type(name);
        await createCustomProjectPage.searchAddress(address);
        await createCustomProjectPage.selectAddress(address);
        await createCustomProjectPage.unitApartmentNumberInput.type(unitNumber);
        projectId = await createCustomProjectPage.createProject();
      }
    );
    await new Projects(page).inside(async (projectsPage) => {
      await projectsPage.validateUrl(projectId);
      await projectsPage.nameLabel.hasText(name);
      await projectsPage.headerStatusLabel.hasText(status);
      await projectsPage.referenceLabel.hasText(`Reference: ${projectId}`);
    });
  });
});
