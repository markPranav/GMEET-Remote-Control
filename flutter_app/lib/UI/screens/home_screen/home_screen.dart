import 'package:flutter/material.dart';
import 'package:gmeet_controller/UI/lode/web_scoket/remote_con_ws_server.dart';
import 'package:network_info_plus/network_info_plus.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  _HomeScreenState createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  RemoteConWSServer rcwss = RemoteConWSServer();
  bool _serverStat = false;
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Gmeet controller'),
      ),
      body: Center(
        child: Column(
          children: [
            FutureBuilder(
                future: NetworkInfo().getWifiIP(),
                builder: (context, AsyncSnapshot<String?> ipAddr) {
                  if (ipAddr.hasData) {
                    return Text("Enter this IP Address: ${ipAddr.data}");
                  }
                  return Text(ipAddr.error.toString());
                }),
            if (_serverStat == false)
              ElevatedButton(
                onPressed: () {
                  rcwss.startServer(context);
                  setState(() {
                    _serverStat = true;
                  });
                },
                child: const Text("Start Connection"),
              )
            else
              ElevatedButton(
                onPressed: () {
                  rcwss.stopServer(context);
                  setState(() {
                    _serverStat = false;
                  });
                },
                child: const Text("Close Connection"),
              ),
            ElevatedButton(
              onPressed: () {
                rcwss.sendMessage("meet", "action", "mute-toggle");
              },
              child: const Text("Toggle Mute"),
            ),
            ElevatedButton(
              onPressed: () {
                print(rcwss.getChannelNames());
              },
              child: const Text("Get Channels"),
            ),
          ],
        ),
      ),
    );
  }
}
