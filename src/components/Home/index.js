import {Component} from 'react'

import Loader from 'react-loader-spinner'

import './index.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatus = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'IN_PROGRESS',
}

class Home extends Component {
  state = {
    category: categoriesList[0].id,
    projectArray: [],
    status: apiStatus.loading,
  }

  componentDidMount() {
    this.getProjects()
  }

  getProjects = async () => {
    const {category} = this.state

    const api = `https://apis.ccbp.in/ps/projects?category=${category}`

    const options = {
      method: 'GET',
    }
    const response = await fetch(api, options)
    if (response.ok === true) {
      const data = await response.json()
      const updateArray = await data.projects.map(each => ({
        id: each.id,
        name: each.name,
        imageUrl: each.image_url,
      }))
      this.setState({projectArray: updateArray, status: apiStatus.success})
    } else {
      this.setState({status: apiStatus.failure})
    }
  }

  changeProject = event => {
    this.setState({category: event.target.value}, this.getProjects)
  }

  onRetry = () => {
    this.getProjects()
  }

  renderSuccess = () => {
    const {projectArray} = this.state
    const Project = props => {
      const {projectItem} = props
      const {id, name, imageUrl} = projectItem

      return (
        <li id={id}>
          <img src={imageUrl} alt={name} />
          <p>{name}</p>
        </li>
      )
    }
    return (
      <ul>
        {projectArray.map(each => (
          <Project key={each.id} projectItem={each} />
        ))}
      </ul>
    )
  }

  renderFailure = () => (
    <div className="col-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong </h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button type="button" onClick={this.onRetry}>
        Retry
      </button>
    </div>
  )

  renderLoad = () => (
    <div data-testid="loader" className="col-container">
      <h1>Loading</h1>
      <Loader type="ThreeDots" color="#3234f8" height={80} width={80} />
    </div>
  )

  renderProjects = () => {
    const {status} = this.state

    switch (status) {
      case apiStatus.success:
        return this.renderSuccess()
      case apiStatus.loading:
        return this.renderLoad()
      case apiStatus.failure:
        return this.renderFailure()

      default:
        return null
    }
  }

  render() {
    const {projectArray, category} = this.state
    console.log(projectArray)

    return (
      <div>
        <nav>
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
            className="logo"
          />
        </nav>
        <ul className="sel-con">
          <select value={category} onChange={this.changeProject}>
            {categoriesList.map(each => (
              <option value={each.id} key={each.id}>
                {each.displayText}
              </option>
            ))}
          </select>
        </ul>
        {this.renderProjects()}
      </div>
    )
  }
}
export default Home
