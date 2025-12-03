import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import IndexEmployee from '../../employee/IndexEmployee'

// Mock react-router navigate
vi.mock('react-router-dom', async (orig) => {
  const actual = await orig()
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  }
})

// Auto-mock our service using the __mocks__ implementation
vi.mock('../../api/service/EmploymentManagement')
import EmploymentManagementService from '../../api/service/EmploymentManagement'

const data = [
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
  {
    id: 3,
    firstName: 'Carla',
    middleName: '',
    lastName: 'Clark',
    designation: 'Lead',
    companyName: 'Acme Inc',
    mobileNo: '3333333333',
    emailId: 'carla@example.com',
  },
]

beforeEach(() => {
  EmploymentManagementService.list.mockResolvedValue([...data])
  EmploymentManagementService.remove.mockResolvedValue({ success: true })
})

describe('IndexEmployee', () => {
  it('renders loading then data', async () => {
    render(<IndexEmployee />)

    // initially show some skeletons
    expect(await screen.findByText(/Employees/i)).toBeInTheDocument()

    // wait for one of the names
    expect(await screen.findByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()

    // header chips count
    // The chip shows rows count
    await waitFor(() => expect(EmploymentManagementService.list).toHaveBeenCalled())
  })

  it('filters by search text', async () => {
    render(<IndexEmployee />)
    await screen.findByText('Alice')

    const input = screen.getByPlaceholderText(/Search name, email, company/i)
    await userEvent.type(input, 'beta')

    // should find Bob with company Beta LLC
    expect(await screen.findByText('Bob')).toBeInTheDocument()
    // Alice from Acme should not be visible
    expect(screen.queryByText('Alice')).not.toBeInTheDocument()
  })

  it('shows empty state when no match', async () => {
    render(<IndexEmployee />)
    await screen.findByText('Alice')

    const input = screen.getByPlaceholderText(/Search name, email, company/i)
    await userEvent.clear(input)
    await userEvent.type(input, 'zzzzzz')

    expect(await screen.findByText(/No employees match your search/i)).toBeInTheDocument()
  })

  it('supports pagination controls', async () => {
    // make more rows to paginate
    EmploymentManagementService.list.mockResolvedValue(
      Array.from({ length: 22 }).map((_, i) => ({
        id: i + 1,
        firstName: `F${i + 1}`,
        middleName: '',
        lastName: `L${i + 1}`,
        designation: 'Engineer',
        companyName: 'Acme',
        mobileNo: '111',
        emailId: `e${i + 1}@example.com`,
      }))
    )

    render(<IndexEmployee />)
    // wait for first cell text
    await screen.findByText('#1', { exact: false })

    // change rows per page to 25 so all show
    const rpp = screen.getByLabelText(/Rows per page/i)
    await userEvent.click(rpp)
    // open listbox and select 25
    const option25 = await screen.findByRole('option', { name: '25' })
    await userEvent.click(option25)

    // Should show email e22 somewhere after updating
    expect(await screen.findByText('e22@example.com')).toBeInTheDocument()
  })

  it('opens delete dialog and calls remove', async () => {
    render(<IndexEmployee />)
    await screen.findByText('Alice')

    // click delete for Alice row
    const row = screen.getByText('Alice').closest('tr')
    const delBtn = within(row).getByRole('button', { name: /delete/i })
    await userEvent.click(delBtn)

    // confirm dialog
    expect(await screen.findByText(/Delete Employee/i)).toBeInTheDocument()
    const confirm = screen.getByRole('button', { name: /delete/i })
    await userEvent.click(confirm)

    await waitFor(() => expect(EmploymentManagementService.remove).toHaveBeenCalled())
  })

  it('navigates to create and edit', async () => {
    // override navigate mock to inspect calls
    const navigateSpy = vi.fn()
    vi.doMock('react-router-dom', async (orig) => {
      const actual = await orig()
      return { ...actual, useNavigate: () => navigateSpy }
    })

    // Re-import component after doMock to use new navigate
    const { default: IndexEmployeeWithNav } = await import('../../employee/IndexEmployee')

    render(<IndexEmployeeWithNav />)
    await screen.findByText('Alice')

    // click New
    await userEvent.click(screen.getByRole('button', { name: /new/i }))
    expect(navigateSpy).toHaveBeenCalledWith('/employees/new')

    // click Edit on Bob
    const row = screen.getByText('Bob').closest('tr')
    const editBtn = within(row).getByRole('button', { name: /edit/i })
    await userEvent.click(editBtn)
    expect(navigateSpy).toHaveBeenCalledWith('/employees/2/edit')
  })
})
