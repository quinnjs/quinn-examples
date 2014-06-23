/** @jsx React.DOM */
'use strict';

let React = require('react');

let Submissions = React.createClass({
  renderItem: function(item) {
    return <li key={item.id}>
      <h4>
        <a href={item.url} key="link">
          {item.title}
        </a>
        {' '}
        <small key="origin">
          <span className="label label-default">{item.domain}</span>
        </small>
      </h4>
    </li>;
  },

  render: function() {
    return this.transferPropsTo(
      <div>
        <ul className="list-unstyled">
          {this.props.items.map(this.renderItem)}
        </ul>
      </div>
    );
  }
});

let SubSidebar = React.createClass({
  render: function() {
    var about = this.props.about;
    return this.transferPropsTo(
      <div>
        <h5>{about.title}</h5>
        <p className="lead">{about.public_description}</p>
      </div>
    );
  }
});

let SubIndexPage = React.createClass({
  render: function() {
    var aboutData = this.props.about.data;
    var submissions = this.props.submissions.data.children.map(function(child) {
      return child.data;
    });

    return <div className="container-fluid">
      <h1>{'/r/' + this.props.subId}</h1>
      <div className="row">
        <Submissions className="col-md-9" items={submissions}  />
        <SubSidebar className="col-md-3" about={aboutData} />
      </div>
    </div>;
  }
});

module.exports = SubIndexPage;
