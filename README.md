# LendSwift Loan Application

React + Vite + Tailwind CSS loan application wizard with React Hook Form, Zod validation, document upload, signature capture, draft autosave, EMI calculation and Cypress smoke tests.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Build

```bash
npm run build
npm run preview
```

## E2E tests

Start the app, then:

```bash
npm run test:e2e
```

or headless:

```bash
npm run test:e2e:run
```

> This is a frontend simulation. Identity verification, loan submission and NBFC/RBI status are demo behavior and are not connected to real financial services.

## SAP-FinSight integration project

The attached enterprise integration assignment is documented separately in [`integration-project/README.md`](integration-project/README.md). It includes the OpenAPI contract and deliverables for architecture, transformation mappings, resilience, reconciliation, monitoring, testing, and deployment.
