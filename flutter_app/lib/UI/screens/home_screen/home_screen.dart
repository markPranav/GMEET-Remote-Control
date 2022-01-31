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
  String _currentChannel = 'None';
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
            const SizedBox(
              height: 20,
            ),
            Container(
              margin: const EdgeInsets.all(10),
              width: 200,
              child: OutlinedButton(
                onPressed: () {
                  List<String> channelList = rcwss.getChannelNames();
                  channelList.isNotEmpty
                      ? showModalBottomSheet(
                          context: context,
                          builder: (BuildContext context) {
                            return Container(
                              color: const Color(0xfff9f5f9),
                              height: 400,
                              padding: const EdgeInsets.all(10),
                              child: Center(
                                child: ListView.builder(
                                  itemBuilder: (context, position) {
                                    return InkWell(
                                      onTap: () {
                                        setState(() {
                                          _currentChannel =
                                              channelList[position];
                                        });
                                        Navigator.of(context).pop();
                                      },
                                      child: Card(
                                        color: (_currentChannel ==
                                                channelList[position])
                                            ? Colors.green[100]
                                            : Colors.white,
                                        child: Padding(
                                          padding: const EdgeInsets.all(12.0),
                                          child: Text(
                                            channelList[position],
                                            style:
                                                const TextStyle(fontSize: 18.0),
                                          ),
                                        ),
                                      ),
                                    );
                                  },
                                  itemCount: channelList.length,
                                ),
                              ),
                            );
                          })
                      : showModalBottomSheet(
                          context: context,
                          builder: (BuildContext context) {
                            return const SizedBox(
                                height: 400,
                                child: Center(
                                    child: Text(
                                  'No Meet is Connected',
                                  style: TextStyle(
                                      color: Colors.green,
                                      fontSize: 25,
                                      fontWeight: FontWeight.w500),
                                )));
                          });
                },
                child: Text('Select a Channel: $_currentChannel'),
                style: OutlinedButton.styleFrom(
                  side: const BorderSide(width: 1.5, color: Colors.green),
                ),
              ),
            ),
            ElevatedButton(
              onPressed: () {
                rcwss.sendMessage(_currentChannel, "action", "mute-toggle");
              },
              child: const Text("Toggle Mute"),
            ),
          ],
        ),
      ),
    );
  }
}
