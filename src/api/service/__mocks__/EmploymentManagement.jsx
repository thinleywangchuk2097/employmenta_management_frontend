const sample = [
  {
    id: 1,
    firstName: 'Alice',
    middleName: '',
    lastName: 'Anderson',
    designation: 'Engineer',
    companyName: 'Acme Inc',
    mobileNo: '1234567890',
    emailId: 'alice@example.com',
  },
  {
    id: 2,
    firstName: 'Bob',
    middleName: 'B',
    lastName: 'Brown',
    designation: 'Manager',
    companyName: 'Beta LLC',
    mobileNo: '5551112222',
    emailId: 'bob@example.com',
  },
]

const EmploymentManagementService = {
  list: vi.fn(async () => sample),
  remove: vi.fn(async (_id) => ({ success: true })),
}

export default EmploymentManagementService
