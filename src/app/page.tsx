import { ChatView } from "@/components/ChatView";
import { ChatProvider } from "@/context/ChatContext";

const HomePage = () => (
  <ChatProvider>
    <ChatView />
  </ChatProvider>
);

export default HomePage;
