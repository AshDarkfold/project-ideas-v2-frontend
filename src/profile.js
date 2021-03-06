import React from 'react'
import {message, Card, Drawer, Tabs} from 'antd'
import {withRouter} from 'react-router-dom'
import Editidea from './edit'

const { TabPane } = Tabs;

class Profile extends React.Component{
    state={
        ideas: [],
        loading: false,
        anyIdea: false,
        mssg: '',
        visibleEdit: false,
        lastEditIdea : {},
        coms:[]
    }

    getCommentData=(othData)=>{
      fetch(`${process.env.REACT_APP_BASEURL}app/user_comments/`, {
        headers: new Headers({
          'Authorization':localStorage.getItem('token')
        }) 
      })
      .then(res=>res.json())
      .then(data=>{
        console.log(data)
        if(data.comments && data.comments.length){
          this.setState({
            coms: data.comments
          })
        }

      })
      .catch(err=>console.error(err))
    }

    componentDidMount(){
        fetch(process.env.REACT_APP_BASEURL+'app/user_idea/', {
            method:'GET',
            headers: new Headers({
                'Authorization':localStorage.getItem('token')
            })
          })
          .then(res=>res.json())
          .then(data=>{
                // console.log(data)
                if(data.message && data.message.length){
                  this.setState({
                    ideas:data.message,
                    })
                }
       
              this.getCommentData(data.message)
          })
          .catch(error=>{
            if(error){
              console.log(error)
              this.setState({
                mssg:"Seems like you haven't posted any ideas yet",
              })
            }
          })


    }
    onClose=()=>{
        this.setState({
            visibleEdit:false
        })
    }
    logout=()=>{
        fetch(process.env.REACT_APP_BASEURL+'app/logout/', {
            headers: new Headers({
                'Authorization': localStorage.getItem("token")
                }),
        }).then(response => response.json())
        .then(data=>{
            localStorage.removeItem("token");
            localStorage.removeItem('user')
            this.props.setlogin()
        })
        .catch(error=>{
            if(error){
                console.error(error);
            }
        })
      }
      openSidea=(id)=>{
        this.props.history.push('/ideas/'+id)
      }

      deleteIdea=(id)=>{
        fetch(process.env.REACT_APP_BASEURL+'app/user_idea/'+id+'/',{
            method:'DELETE',
            headers: new Headers({
                Authorization: localStorage.getItem('token')
            })
          })
          .then(res=>res.json())
          .then(data=>{
              console.log(data)
            let ideaList = this.state.ideas.filter(x => {
                return x.id !== id;
              })
              this.setState({
                ideas: ideaList
              })
              message.info('Idea deleted')
          })
          .catch(error=>{
            if(error){
            //   this.props.history.push('/ideas')
            console.log(error)
            }
          })

      }

      openEdit=(id)=>{
        fetch(process.env.REACT_APP_BASEURL+'app/view_idea/'+id+'/',{
            method:'GET'
          })
          .then(res=>res.json())
          .then(data=>{
            this.setState({
                lastEditIdea:data.message,
                visibleEdit: true
            })
          })
          .catch(error=>{
            if(error){
            //   this.props.history.push('/ideas')
            console.log(error)
            }
          })
      }

      handleChange=(e)=>{
        console.log(e)
      }

    render(){
        const {ideas, mssg, coms}=this.state
        var dataDisp = ideas.length?(
          ideas.map(data=>{
            let desc=''
            if(data.project_description.length>=170){
              desc = data.project_description.substring(0,170)+'...'
            }else{
              desc = data.project_description;
            }
            return(
              <Card key={data.id}>
              <h3>
                {data.project_title}
              </h3>
              <p className="idea-desc">{desc}</p>
              <p style={{color:"#2785FC", marginTop:'20px'}}>
                {data.votes} Votes
              </p>
              <div className="profile-card-buttonholder">
                <button onClick={()=>{this.deleteIdea(data.id)}}>Delete</button>
                <button onClick={()=>{this.openEdit(data.id)}}>Edit</button>
                <button  onClick={()=>{this.openSidea(data.id)}}>View</button>
              </div>
            </Card>
            )
          })
        ):(<div style={{textAlign:"center"}}>{mssg}</div>)

        let theComs = coms.length?(coms.map(data=>{
          let desc=''
            if(data.body.length>=170){
              desc = data.body.substring(0,170)+'...'
            }else{
              desc = data.body;
            }
          return(
            <Card key={data.id} style={{cursor:'pointer'}} onClick={()=>{this.props.history.push(`/ideas/${data.idea_id}`)}}>
              <h3>
                {data.idea_title}
              </h3>
              <p className="idea-desc">{desc}</p>
          </Card>
          )
        })):(<div>Seems like you haven't interacted much with people here :/</div>)
        return(
            <div className="profile-par">
                <div className="logout-button">
                    <button onClick={this.logout}>Logout</button>
                </div>
                <div className="profile-ideas">
                    <Tabs defaultActiveKey="1" onChange={this.handleChange} centered={true}>
                        <TabPane tab="Your Ideas" key="1">
                          {dataDisp}
                        </TabPane>
                        <TabPane tab="Your Comments" key="2">
                          {theComs}
                        </TabPane>
                    </Tabs>
                </div>
                <Drawer
                        placement="right"
                        closable={true}
                        onClose={this.onClose}
                        visible={this.state.visibleEdit}
                        width={window.innerWidth<400?(window.innerWidth):(400)}
                        zIndex="2001"
                    >
                      <Editidea closeThis={this.onClose} ideaData={this.state.lastEditIdea}/>

                </Drawer>
            </div>
        )
    }
}

export default withRouter(Profile)