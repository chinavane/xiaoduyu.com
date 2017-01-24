import React, { Component, PropTypes } from 'react'
import { Link, browserHistory } from 'react-router'

import { DateDiff } from '../../common/date'

import styles from './style.scss'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { loadAnswerById } from '../../actions/answer-list'
import { getAnswerById } from '../../reducers/answer-list'
import { showSign } from '../../actions/sign'
import { getAccessToken, getProfile } from '../../reducers/user'

import Shell from '../../shell'
import Meta from '../../components/meta'
import Nav from '../../components/nav'
import Subnav from '../../components/subnav'
import CommentList from '../../components/comment-list'
import HTMLText from '../../components/html-text'
import Share from '../../components/share'
import LikeButton from '../../components/like'


class Answer extends React.Component {


  constructor(props) {
    super(props)
    this.addComment = this._addComment.bind(this)
  }

  _addComment() {
    const { isSignin, showSign } = this.props
    const [ answer ] = this.props.answer

    if (isSignin) {
      browserHistory.push('/write-comment/'+answer._id)
    } else {
      showSign()
    }
  }

  componentWillMount() {
    /*
    const self = this
    const [ answer ] = this.props.answer
    const { loadAnswerById } = this.props

    if (answer) return

    let id = this.props.params.id

    loadAnswerById({ id })
    */
  }

  render () {

    const { me, isSignin, showSign } = this.props

    const [ answer ] = this.props.answer

    if (!answer) {
      return(<div></div>)
    }

    let question = answer ? answer.question_id : null

    /*
    <Subnav
      middle="回复详情"
      right={<a href='javascript:void(0);' onClick={this.addComment}>回复</a>}
    />
    */

    return (
      <div>
        <Meta meta={{ title: answer.question_id.title + ' - ' + answer.user_id.nickname + '的评论' }} />

        <Nav />

        <div className="container">
          <div className={styles.question}>
            <Link to={`/topic/${question._id}`}>{question.title}</Link>
          </div>
        </div>

        <div className="container">
          <div className={styles.item}>

            <div className={styles.head}>
              {/*
              <span className={styles.share}>

              </span>
              */}
              <span>
                <Link to={`/people/${answer.user_id._id}`}>
                  <img className={styles.avatar} src={answer.user_id.avatar_url} />
                  {answer.user_id.nickname}
                </Link>
              </span>
              <span>
                {DateDiff(answer.create_at)}
              </span>

              {answer.like_count > 0 ? <span>{answer.like_count} 个赞</span> : null}

            </div>

            <div><HTMLText content={answer.content_html} /></div>

          </div>

          <div className={styles.other}>

            <div className={styles.actions}>

              <LikeButton answer={answer} />

              {isSignin ?
                  <Link to={`/write-comment/${answer._id}`}>回复</Link> :
                  <a href="javascript:void(0);" onClick={showSign}>回复</a>}

              {me._id && answer.user_id._id ? <Link to={`/edit-answer/${answer._id}`}>编辑</Link> : null}
            </div>

            <Share
              title={answer.question_id.title + ' - ' + answer.user_id.nickname + '的答案'}
              url={this.props.location.pathname}
              />

          </div>

        </div>

        <CommentList name={answer._id} filters={{ answer_id: answer._id }} />

      </div>
    )

  }
}

Answer.propTypes = {
  answer: PropTypes.array.isRequired,
  loadAnswerById: PropTypes.func.isRequired,
  isSignin: PropTypes.bool.isRequired,
  showSign: PropTypes.func.isRequired,
  me: PropTypes.object.isRequired
}

function mapStateToProps(state, props) {

  const answerId = props.params.id

  return {
    answer: getAnswerById(state, answerId),
    isSignin: getAccessToken(state) ? true : false,
    me: getProfile(state)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    loadAnswerById: bindActionCreators(loadAnswerById, dispatch),
    showSign: bindActionCreators(showSign, dispatch)
  }
}

Answer = connect(mapStateToProps, mapDispatchToProps)(Answer)

export default Shell(Answer)
