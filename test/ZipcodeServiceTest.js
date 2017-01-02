var assert = require('assert')

var carbon = require('carbon-io')
var o      = carbon.atom.o(module).main
var _o     = carbon.bond._o(module)
var __     = carbon.fibers.__(module).main

/***************************************************************************************************
 * ZipcodeServiceTest
 */
__(function() {
  module.exports = o({

    /***************************************************************************
     * _type
     */
    _type: carbon.carbond.test.ServiceTest,

    /***************************************************************************
     * name
     */
    name: "ZipcodeServiceTest",

    /***************************************************************************
     * service
     */
    service: _o('../lib/ZipcodeService'),
  
    /***************************************************************************
     * suppressServiceLogging
     */
    suppressServiceLogging: true,

    /***************************************************************************
     * setup
     */
    setup: function() {
      carbon.carbond.test.ServiceTest.prototype.setup.call(this)
      this.service.db.command({dropDatabase: 1})
    },

    /***************************************************************************
     * teardown
     */
    teardown: function() {
      this.service.db.command({dropDatabase: 1})
      carbon.carbond.test.ServiceTest.prototype.teardown.call(this)
    },

    /***************************************************************************
     * tests
     */
    tests: [
      // Test POST by inserting some zipcodes
      {
        reqSpec: {
          url: '/zipcodes',
          method: "POST",
          body: { _id: "94114", state: "CA" }
        },
        resSpec: {
          statusCode: 201,
          body: { _id: "94114", state: "CA" }
        }
      },
      {
        reqSpec: {
          url: '/zipcodes',
          method: "POST",
          body: { _id: "94110", state: "CA" }
        },
        resSpec: {
          statusCode: 201
        }
      },
      {
        reqSpec: {
          url: '/zipcodes',
          method: "POST",
          body: { _id: "10011", state: "NY" }
        },
        resSpec: {
          statusCode: 201
        }
      },

      // Test invalid POSTS. These should get a 400 status code (Bad Request)
      {
        reqSpec: {
          url: '/zipcodes',
          method: "POST",
          body: { _id: "1", state: "NY" } // Malformed zipcode
        },
        resSpec: {
          statusCode: 400
        }
      },
      {
        reqSpec: {
          url: '/zipcodes',
          method: "POST",
          body: { _id: "10012", state: "NYC" } // Malformed state identifier
        },
        resSpec: {
          statusCode: 400
        }
      },

      // Test searching for zipcodes
      {
        reqSpec: {
          url: '/zipcodes',
          method: "GET",
          parameters: { 
            query: { state: "CA" }
          }
        },
        resSpec: {
          statusCode: 200,
          body: function(body) {
            assert(body.length === 2)
            return true
          }
        }
      },
      {
        reqSpec: {
          url: '/zipcodes',
          method: "GET",
          parameters: { 
            query: { state: "NY" }
          }
        },
        resSpec: {
          statusCode: 200,
          body: [ { _id: "10011", state: "NY" } ]
        }
      },

      // Test bad search
      {
        reqSpec: {
          url: '/zipcodes',
          method: "GET",
          parameters: { 
            query: { foo: 2 } // We should not be allowed to seach by any field except 'state'
          }
        },
        resSpec: {
          statusCode: 400
        }
      },

      // Test looking up single zipcode
      {
        reqSpec: {
          url: '/zipcodes/94114',
          method: "GET"
        },
        resSpec: {
          statusCode: 200,
          body: { _id: "94114", state: "CA" }
        }
      },

      // Test looking up removing a zipcode
      {
        reqSpec: {
          url: '/zipcodes/94114',
          method: "DELETE"
        },
        resSpec: {
          statusCode: 200
        }
      },
      {
        reqSpec: {
          url: '/zipcodes/94114',
          method: "GET"
        },
        resSpec: {
          statusCode: 404 // Should no longer exist
        }
      },
      {
        reqSpec: {
          url: '/zipcodes',
          method: "GET"
        },
        resSpec: {
          statusCode: 200,
          body: function(body) {
            assert(body.length === 2) // Should only have two now
            return true
          }
        }
      },
    ]

  })
})
