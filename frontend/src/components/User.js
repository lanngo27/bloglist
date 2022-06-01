import { ListGroup } from 'react-bootstrap'
const User = ({ user }) => {
  if (!user) return null
  return (
    <div>
      <h3 className="text-center">Blogs added by {user.name}</h3>
      <ListGroup>
        {user.blogs.map((b) => (
          <ListGroup.Item
            key={b.id}
            variant="light"
            as="ul"
            className="border-0 m-0 list-group-item"
          >
            {b.title}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  )
}

export default User
