import http from "http";
import SocketServices from "./services/socket";
import { startMessageConsumer } from "./services/kafka";
async function init() {
  await startMessageConsumer();
  const socketService = new SocketServices();

  // creating a http server, need for handshaking of socket server
  const httpServer = http.createServer();
  const PORT = process.env.PORT ? process.env.PORT : 8000;

  socketService.io.attach(httpServer);

  httpServer.listen(PORT, () => {
    console.log(`Http Server started at PORT: ${PORT}`);
  });

  //   initializin event listner
  socketService.initListners();
}

init();
