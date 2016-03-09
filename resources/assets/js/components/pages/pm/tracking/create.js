module.exports = {
  data: function () {
    return {
      timelog: {
        userid: '',
        startdate: '',
        enddate: '',
        minutes: 0,
        client_id: null,
        project_id: null,
        task_id: null,
        billable: false,
        visible: false
      },
      messages: [],
      clients: [],
      options1: [
        "value1",
        "value2",
        "value3"
      ],
      result1: ""
    }
  },
  ready: function() {
      $("#startdate").inputmask('datetime', {greedy: false});
      $("#enddate").inputmask('datetime', {greedy: false});
  },
  methods: {
    createTimelog: function (e) {
      e.preventDefault()
      var that = this
      client({path: 'tracking', entity: this.timelog}).then(
        function (response, status) {
          that.timelog.client_id = ''
          that.timelog.project_id = ''
          that.messages = [ {type: 'success', message: 'The timelog has been created successfully'} ]
          Vue.nextTick(function () {
            document.getElementById('startdate').focus()
          })
        },
        function (response, status) {
          that.messages = []
          for (var key in response.entity) {
            that.messages.push({type: 'danger', message: response.entity[key]})
          }
        }
      )
    },
    // Let's get the clients
    fetch: function (successHandler) {
      var that = this
      client({ path: '/clients' }).then(
        function (response) {
          //Set the clients
          that.$set('clients', response.entity.data)
          successHandler(response.entity.data)
        },
        function (response, status) {
          if (_.contains([401, 500], status)) {
            that.$dispatch('userHasLoggedOut')
          }
        }
      )
    },
  },
  route: {
    // fetch the list of clients
    data: function (transition) {
      this.fetch(function (data) {
        transition.next({clients: data.clients})
      })
      
    }
  }
}
