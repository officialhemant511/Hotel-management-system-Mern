import React from 'react'

function Navbar() {
  const user = JSON.parse(localStorage.getItem('currentUser'))

  function logout() {
    localStorage.removeItem('currentUser')
    window.location.href = '/login'
  }

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">BookiZee</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"  ><i class="fa fa-bars" style={{ color: 'white' }} ></i></span>
          </button>
          <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul className="navbar-nav" style={{ color: 'white' }}>  {/* Added style for the menu */}
              {user ? (
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <i class="fa-solid fa-user me-2"></i>{user.name}
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                    <li><a className="dropdown-item" href="/profile">Profile</a></li>
                    <li><a className="dropdown-item" href="#" onClick={logout}>Logout</a></li>
                  </ul>
                </li>
              ) : (
                <>
                  <li className="nav-item">
                    <a className="nav-link" href="/register">Register</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="/login">Login</a>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Navbar
