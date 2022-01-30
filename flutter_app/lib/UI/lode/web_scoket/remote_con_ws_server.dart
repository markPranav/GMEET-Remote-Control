import 'package:flutter/material.dart';
import 'package:network_info_plus/network_info_plus.dart';
import 'package:shelf/shelf_io.dart' as shelf_io;
import 'package:shelf_web_socket/shelf_web_socket.dart';
import 'package:web_socket_channel/web_socket_channel.dart';
import 'dart:io';
import 'dart:convert';

class RemoteConWSServer {
  Map<String, WebSocketChannel> _channels = {};
  HttpServer? _server;
  // final BuildContext context;

  RemoteConWSServer();

  bool isServerOn() {
    return _server != null;
  }

  bool isChannelOn() {
    return _channels != null;
  }

  List<String> getChannelNames() {
    return _channels.keys.toList();
  }

  /* 
    Every message passed between devices will have
    {
      query: ,
      message: ,
    }

    queries are:- set-name, 
  
  */

  Future<void> startServer(BuildContext context) async {
    var handler = webSocketHandler((WebSocketChannel webSocket) {
      // webSocket.sink.add("Connected");
      webSocket.stream.listen((data) {
        print(data);
        data = jsonDecode(data);
        String query = data['query'];
        switch (query) {
          case "set-name":
            _channels[data['message']] = webSocket;
            break;
          default:
            webSocket.sink.add("Error");
        }

        // webSocket.sink.add('echo $data');
      });
    });

    String? myIp = await NetworkInfo().getWifiIP();

    shelf_io.serve(handler, myIp, 3000).then((server) {
      _server = server;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content:
              Text('Serving at ws://${server.address.host}:${server.port}'),
        ),
      );
    });
  }

  void sendMessage(String channel, String query, String message) {
    _channels[channel]!
        .sink
        .add(jsonEncode({'query': query, 'data': message}));
  }

  void stopServer(BuildContext context) {
    if (_server == null) {
      return;
    }

    _channels.forEach((key, value) =>
        value.sink.close(WebSocketStatus.goingAway, "Server closed"));
    _server!.close(force: true);
    _channels = {};
    _server = null;

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Closed Connection'),
      ),
    );
  }
}
