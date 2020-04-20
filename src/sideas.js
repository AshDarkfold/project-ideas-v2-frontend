import React, { Component } from 'react'
import {withAlert} from 'react-alert'
import Nav from './nav'
import { Card, Row, Col, Input, Form, Pagination} from 'antd'
import{CaretDownFilled, CaretUpFilled, MessageOutlined} from '@ant-design/icons'



class Sideas extends Component{
    constructor(props) {
        super(props);
        this.state={
          isLoggedIn: false,
          idea: [],
          comment:[],
          total:1
        }
    }
  
  onChange=(value)=>{
    console.log(value)
  }

    onBlur=()=>{
      console.log('blur');
    }
    
  onFocus=()=>{
      console.log('focus');
    }
    
  onSearch=(val)=>{
      console.log('search:', val);
    }
  componentDidMount=()=>{
        fetch(process.env.REACT_APP_BASEURL+'app/view_idea/'+this.props.match.params.ideaID+'/',{
          method:'GET'
        })
        .then(res=>res.json())
        .then(data=>{
          console.log(data)
          this.setState({
            idea: data.message
          })
        })
        .catch(error=>console.error(error))

        fetch(process.env.REACT_APP_BASEURL+'app/comment/'+this.props.match.params.ideaID+'/?offset=0',{
            method:'GET'
          })
        .then(res=>res.json())
        .then(data=>{
          console.log(data)
            this.setState({
              comment: data.message,
              total:data.total_pages
            })
        })
        .catch(error=>console.error(error))
       
    }

    addVote=(vote, id)=>{

      let cardsVoted = this.state.idea;

      console.log('otherstuff',vote, id)
     let votebody = {
        'idea_id':id,
        'vote_type':vote
      }
      fetch(process.env.REACT_APP_BASEURL+'app/vote/',{
        method:'POST',
        headers: new Headers({
          'Content-type': 'application/json',
          'Authorization': localStorage.getItem('token')
        }),
        body:JSON.stringify(votebody)
      })
      .then(res=>{
        if(res.status===200 || res.status===201 ||res.status===202||res.status===203||res.status===204){
          cardsVoted.votes += vote 
          this.setState({
            idea: cardsVoted
          })
          return(res.json())
        }else{
          return(res.json())
        }
      })
      .then(data=>{
        this.props.alert.show(data.message)
      })
      .catch(error=>console.error(error))
      // this.setState({
        
      // })
    }
addComment=(id, e, pid, index)=>{
  let votebody={
    'idea_id':id,
    'body':e.body,
    'parent_comment_id':pid
  }
  console.log(index)
  fetch(process.env.REACT_APP_BASEURL+'app/comment/',{
    method:'POST',
    headers: new Headers({
      'Content-type': 'application/json',
      'Authorization': localStorage.getItem('token')
    }),
    body:JSON.stringify(votebody)
  })
  .then(res=>res.json())
  .then(data=>{
    console.log(data)
    console.log(this.state.comment)
    if(index){
      var reply = this.state.comment
      reply[index].child_comments.push(data.message)
      this.setState({
        comment: reply
      })
    }else{
      // var com = this.state.comment
      // com.push(data.message)
      // this.setState({
      //   comment:com
      // })
      window.location.reload()
    }
    // window.location.reload()

  // this.state.comment
    // this.props.alert.show(data.message)
  })
  .catch(error=>console.error(error))
}

changePage=(page)=>{
  fetch(process.env.REACT_APP_BASEURL+'app/comment/'+this.props.match.params.ideaID+'/?offset='+(page-1), {
    method:'GET'
  })
  .then(res=>res.json())
  .then(data=>{
    console.log(data)
    this.setState({
      comment:data.message
    })
  })
  .catch(error=>{
    if(error){
      console.log(error)
    }
  })
}
  
    render(){
      var {comment} = this.state;
      var coms = comment.map((data,dataindex)=>{
        let theDate = data.date_time.substring(0,10);
        var reps = data.child_comments.length>0?(data.child_comments.map((child)=>{
          let repDate = child.date_time.substring(0,10);
          return(
            <Row gutter={16} className="subReply" key={child.id}>
            <Col span={1} className="vote">
            </Col>
            <Col span={22} className='card-cont '>
              <div><span style={{padding:'0px 20px 15px 0px', fontWeight:'900'}}>{child.username} </span><span style={{paddingBottom:'15px', color:'gray'}}>{repDate}</span></div>
              <div><h3>{child.body}</h3></div>
            </Col>
          </Row>
          )
        })
        ):(<div></div>);
        return(
          <div key={data.id}>  
          <Row gutter={16} className="mainReply">
            <Col span={1} className="vote">
            </Col>
            <Col span={22} className='card-cont '>
              <div><span style={{padding:'0px 20px 15px 0px', fontWeight:'900'}}>{data.username} </span><span style={{paddingBottom:'15px', color:'gray'}}>{theDate}</span></div>
              <div><h3>{data.body}</h3></div>
              <div> 
              <Form className="sikebich" onFinish={(val)=>{this.addComment(data.idea_id, val, data.id, dataindex)}}>
                    <Form.Item
                      name="body"
                    >
                      <Input placeholder="Reply..." prefix={<MessageOutlined style={{color:'#2785FC', marginRight:'5px'}} />} /> 
                    </Form.Item>
                  </Form>
               </div>
            </Col>
          </Row>
          {reps}
          <hr />  
          </div>
        )
      })
      return(
      <div>
        <Nav active='ideas'/>
        <div className="main">
          {/* <div className="countryCss">
            <Select
                showSearch
                placeholder="Search for ideas"
                optionFilterProp="children"
                onChange={this.onChange}
                onFocus={this.onFocus}
                onBlur={this.onBlur}
                onSearch={this.onSearch}
                filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
            >
              <Option key='1' value='bandersnatch'>Bandersnatch</Option>
              <Option key='2' value='bandersnatch'>Bandersnatch</Option>
              <Option key='3' value='bandersnatch'>Bandersnatch</Option>
              <Option key='4' value='bandersnatch'>Bandersnatch</Option>
            </Select>
          </div> */}
          <div className="IdeaCards">
            <Card key={this.state.idea.id}>
              <Row gutter={16}>
                <Col span={1} className="vote">
                  <CaretUpFilled style={{color:'#2785FC'}} onClick={()=>{this.addVote(1, this.state.idea.id)}} />
                  <p>{this.state.idea.votes}</p>
                  <CaretDownFilled style={{color:'#2785FC'}} onClick={()=>{this.addVote(-1, this.state.idea.id)}} />
                </Col>
                <Col span={22} className='card-cont'>
                  <div><p>{this.state.idea.username}</p></div>
                  <div><h2>{this.state.idea.project_title}</h2></div>
                  <div><h3>{this.state.idea.project_description}</h3></div>
                  <div> 
                  <Form name="parentComment" className="sikebich" onFinish={(val)=>{this.addComment(this.state.idea.id, val, this.state.idea.parent_comment_id)}}>
                    <Form.Item
                      name="body"
                    >
                      <Input placeholder="Add a comment" prefix={<MessageOutlined style={{color:'#2785FC', marginRight:'5px'}} />} /> 
                    </Form.Item>
                  </Form>
                  </div>  
                </Col>
              </Row>
              <hr />  
             {coms}
            </Card>
          </div>
          <div className="paginationDiv">
          <Pagination defaultCurrent={1} pageSize={5} total={this.state.total*5} onChange={(page)=>this.changePage(page)}/>
          </div>
        </div>
      </div>)
    }
}

export default withAlert()(Sideas)
