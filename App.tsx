import React, { useState } from 'react';
import { Platform, View, Text, TextInput, Button } from 'react-native';

let sendMessage: ((message: string) => Promise<string>) | null = null;

if (
  Platform.OS === 'ios' &&
  parseInt(Platform.Version as string, 10) >= 18
) {
  try {
    const appleModule = require('@react-native-ai/apple');
    if (typeof appleModule.sendMessage === 'function') {
      sendMessage = appleModule.sendMessage;
    }
  } catch (err) {
    console.warn('AppleLLM not available:', err);
  }
}

export default function App() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const ask = async () => {
    if (!sendMessage) {
        // for poor people
      setAnswer(' Apple Intelligence not available on this device.');
      return;
    }

    try {
      const result = await sendMessage(question);
      setAnswer(result);
    } catch (err: any) {
      setAnswer('Error: ' + err.message);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          width: '100%',
          marginBottom: 12,
          padding: 8,
          fontSize: 16,
        }}
        placeholder="Ask something..."
        value={question}
        onChangeText={setQuestion}
      />
      <Button title="Ask Apple Intelligence" onPress={ask} />
      <Text style={{ marginTop: 20, fontSize: 16 }}>{answer}</Text>
    </View>
  );
}
