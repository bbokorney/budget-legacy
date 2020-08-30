/**
 * @fileoverview gRPC-Web generated client stub for transactions
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


/* eslint-disable */
// @ts-nocheck



const grpc = {};
grpc.web = require('grpc-web');


var google_protobuf_empty_pb = require('google-protobuf/google/protobuf/empty_pb.js')
const proto = {};
proto.transactions = require('./transactions_pb.js');

/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.transactions.TransactionsServiceClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

};


/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.transactions.TransactionsServicePromiseClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.transactions.Transaction,
 *   !proto.google.protobuf.Empty>}
 */
const methodDescriptor_TransactionsService_AddTransaction = new grpc.web.MethodDescriptor(
  '/transactions.TransactionsService/AddTransaction',
  grpc.web.MethodType.UNARY,
  proto.transactions.Transaction,
  google_protobuf_empty_pb.Empty,
  /**
   * @param {!proto.transactions.Transaction} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  google_protobuf_empty_pb.Empty.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.transactions.Transaction,
 *   !proto.google.protobuf.Empty>}
 */
const methodInfo_TransactionsService_AddTransaction = new grpc.web.AbstractClientBase.MethodInfo(
  google_protobuf_empty_pb.Empty,
  /**
   * @param {!proto.transactions.Transaction} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  google_protobuf_empty_pb.Empty.deserializeBinary
);


/**
 * @param {!proto.transactions.Transaction} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.google.protobuf.Empty)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.google.protobuf.Empty>|undefined}
 *     The XHR Node Readable Stream
 */
proto.transactions.TransactionsServiceClient.prototype.addTransaction =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/transactions.TransactionsService/AddTransaction',
      request,
      metadata || {},
      methodDescriptor_TransactionsService_AddTransaction,
      callback);
};


/**
 * @param {!proto.transactions.Transaction} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.google.protobuf.Empty>}
 *     Promise that resolves to the response
 */
proto.transactions.TransactionsServicePromiseClient.prototype.addTransaction =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/transactions.TransactionsService/AddTransaction',
      request,
      metadata || {},
      methodDescriptor_TransactionsService_AddTransaction);
};


module.exports = proto.transactions;

