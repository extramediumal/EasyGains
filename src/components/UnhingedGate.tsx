// src/components/UnhingedGate.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Modal,
} from 'react-native';
import { Button } from './Button';
import { Colors, Radii, Spacing } from '../lib/theme';
import {
  PROTECTOR_QUESTIONS,
  validateProtectorAnswers,
  validatePassphrase,
  getRandomDenialMessage,
} from '../lib/unhingedGating';

interface UnhingedGateProps {
  visible: boolean;
  onClose: () => void;
  onUnlocked: () => void;
}

type Stage = 'protector' | 'passphrase' | 'denied' | 'unlocked';

export function UnhingedGate({ visible, onClose, onUnlocked }: UnhingedGateProps) {
  const [stage, setStage] = useState<Stage>('protector');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [passphrase, setPassphrase] = useState('');
  const [denialMessage, setDenialMessage] = useState('');

  function reset() {
    setStage('protector');
    setQuestionIndex(0);
    setAnswers([]);
    setPassphrase('');
    setDenialMessage('');
  }

  function handleAnswer(answer: string) {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (questionIndex < PROTECTOR_QUESTIONS.length - 1) {
      setQuestionIndex(questionIndex + 1);
    } else {
      if (validateProtectorAnswers(newAnswers)) {
        setStage('passphrase');
      } else {
        setDenialMessage(getRandomDenialMessage());
        setStage('denied');
      }
    }
  }

  function handlePassphrase() {
    if (validatePassphrase(passphrase)) {
      setStage('unlocked');
      onUnlocked();
    } else {
      setDenialMessage(getRandomDenialMessage());
      setStage('denied');
    }
  }

  function handleClose() {
    reset();
    onClose();
  }

  const question = PROTECTOR_QUESTIONS[questionIndex];

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.card}>
          {stage === 'protector' && question && (
            <>
              <Text style={styles.title}>⚠️ Warning</Text>
              <Text style={styles.question}>{question.question}</Text>
              {question.options.map((opt) => (
                <View key={opt} style={styles.optionContainer}>
                  <Button
                    title={opt}
                    variant="secondary"
                    onPress={() => handleAnswer(opt)}
                  />
                </View>
              ))}
            </>
          )}

          {stage === 'passphrase' && (
            <>
              <Text style={styles.title}>🔐 Final Step</Text>
              <Text style={styles.question}>Enter the passphrase.</Text>
              <TextInput
                style={styles.input}
                value={passphrase}
                onChangeText={setPassphrase}
                placeholder="Type it here..."
                autoCapitalize="none"
                autoCorrect={false}
              />
              <Button title="Submit" onPress={handlePassphrase} />
            </>
          )}

          {stage === 'denied' && (
            <>
              <Text style={styles.title}>❌</Text>
              <Text style={styles.denial}>{denialMessage}</Text>
              <Button title="OK" variant="ghost" onPress={handleClose} />
            </>
          )}

          {stage === 'unlocked' && (
            <>
              <Text style={styles.title}>🔓</Text>
              <Text style={styles.denial}>Coach AL has entered the chat.</Text>
              <Button title="Let's go" onPress={handleClose} />
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.screenPadding,
  },
  card: {
    backgroundColor: Colors.background,
    borderRadius: Radii.card,
    padding: Spacing.cardPadding * 1.5,
    width: '100%',
    maxWidth: 360,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  question: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 24,
  },
  optionContainer: {
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    borderRadius: Radii.input,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  denial: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 24,
    color: Colors.textSecondary,
  },
});
