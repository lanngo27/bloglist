import { Link } from 'react-router-dom'
import { Table } from 'react-bootstrap'

const Users = ({ users }) => {
  return (
    <div>
      <h2>Users</h2>
      <Table variant="default" style={{ margin: '20px auto' }} striped bordered>
        <tbody>
          <tr>
            <th></th>
            <th>
              <b>Blogs created</b>
            </th>
          </tr>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <Link to={`/users/${user.id}`}>{user.name}</Link>
              </td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

export default Users
