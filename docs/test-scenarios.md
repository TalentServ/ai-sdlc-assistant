# Test Scenarios — Document Approval Workflow

Automated coverage for the **AI SDLC Pipeline Assistant**, mapped to the six test plan categories required by Challenge 3.

**Run all tests:** `npm test`

**List all test names (no execution):** `npm run test:list`

**Save verbose run to file:** `npm run test:report` → `test-results.txt`

Each automated test prints a **scenario ID**, **description**, and **expected result** during `npm test` (see `tests/scenario-catalog.ts`).

| Category | Test file(s) | Count |
|----------|--------------|-------|
| Unit | `tests/unit/*` | 8+ |
| API | `tests/api/*` | 7 |
| UI | `tests/ui/*` | 9 |
| Regression | `tests/regression/*` | 5 |
| Negative | `tests/negative/*` | 7 |
| Security | `tests/security/*` | 4 |

---

## Unit test scenarios

| ID | Scenario | Expected result |
|----|----------|-----------------|
| U-01 | Validate complete mock pipeline against Zod schema | Parse succeeds |
| U-02 | Reject pipeline missing required sections | Schema throws |
| U-03 | Readiness score stays within 0–100 | Score in range |
| U-04 | Open questions → `needs_clarification` status | Status derived correctly |
| U-05 | High-severity risks → `high_risk` status | Status derived correctly |
| U-06 | Markdown export includes all major headings | All sections present |
| U-07 | Mock orchestrator runs without OpenAI key | Pipeline returned |
| U-08 | All six test plan categories populated in mock output | Each category has items |

---

## API test scenarios

| ID | Scenario | Expected result |
|----|----------|-----------------|
| A-01 | POST `/api/pipeline` without auth | `401 Unauthorized` |
| A-02 | POST `/api/pipeline` with valid requirement | `200` + full pipeline JSON |
| A-03 | Response includes all six test plan categories | Each array non-empty |
| A-04 | Delivery readiness score in response | Score 0–100, valid status |
| A-05 | POST `/api/export` without auth | `401 Unauthorized` |
| A-06 | POST `/api/export` with valid pipeline | Markdown file + headers |
| A-07 | POST `/api/export` with invalid pipeline | `400` with error message |

---

## UI test scenarios

| ID | Scenario | Expected result |
|----|----------|-----------------|
| UI-01 | ReadinessScore shows score and status | Score, label, recommendation visible |
| UI-02 | ReadinessScore lists approval needs | Approval items rendered |
| UI-03 | Ready status displays "Ready" label | Correct badge text |
| UI-04 | Generate button disabled for short requirement | Button disabled |
| UI-05 | Generate button enabled for valid requirement | Button enabled |
| UI-06 | Click Generate invokes submit handler | `onSubmit` called |
| UI-07 | Loading state shows generating label | Button disabled + loading text |
| UI-08 | PipelineResults renders all SDLC sections | 6 section headings visible |
| UI-09 | Export and copy buttons present | Both actions rendered |

---

## Regression test scenarios

| ID | Scenario | Expected result |
|----|----------|-----------------|
| R-01 | Mock pipeline remains schema-valid | No parse errors |
| R-02 | Demo mode reports all five agent stages | Five stages in completed list |
| R-03 | Markdown export headings unchanged | All headings present |
| R-04 | Agent stage order contract stable | 5 stages in defined order |
| R-05 | Approval workflow sample still detected | Summary contains "approval" |

---

## Negative test scenarios

| ID | Scenario | Expected result |
|----|----------|-----------------|
| N-01 | Requirement under 10 characters | Schema / API rejects |
| N-02 | Empty/short requirement via API | `400` response |
| N-03 | Malformed JSON body | `400` response |
| N-04 | Export without pipeline object | `400` response |
| N-05 | Pipeline call without session | `401` response |
| N-06 | Export call without session | `401` response |
| N-07 | Invalid pipeline shape on export | `400` response |

---

## Security test scenarios

| ID | Scenario | Expected result |
|----|----------|-----------------|
| S-01 | Anonymous pipeline generation blocked | `401` |
| S-02 | Anonymous export blocked | `401` |
| S-03 | Requirement containing `<script>` handled safely | No script in markdown output |
| S-04 | API errors do not leak stack traces | No stack in JSON body |
| S-05 | Generated test plan includes security scenarios | Security category covers RBAC/XSS |

---

## Sample requirement scenarios (manual / demo)

These scenarios are produced by the **Test Planner agent** (or mock pipeline) for the document approval workflow sample:

### Unit
- State machine rejects invalid transitions (e.g., approve from Draft)
- RBAC helper returns correct permissions per role
- Notification payload builder masks sensitive fields

### API
- POST submit returns 403 for non-owner creator
- POST approve transitions status and writes audit record
- GET audit-trail returns ordered actions with actor metadata
- External collaborator POST approve returns 403

### UI
- Creator can upload, save draft, and submit for approval
- Approver sees pending queue and can approve/reject/request changes
- Collaborator can comment but cannot see approve actions
- Status timeline reflects each transition with timestamps

### Regression
- Existing document list/search unaffected after workflow rollout
- Legacy documents without workflow metadata remain accessible

### Negative
- Double-submit approval action is idempotent or rejected
- Missing required comment on reject returns 400
- Expired session mid-approval redirects to login

### Security
- Horizontal privilege escalation: user A cannot approve user B's document
- Audit records cannot be modified via API
- Comment input sanitized against XSS
- Rate limiting on submit and comment endpoints

---

## Evidence for submission

```bash
npm test
```

Capture terminal output or CI logs showing all categories passing. Reference this document in your hackathon submission checklist under **Test cases or validation evidence**.
