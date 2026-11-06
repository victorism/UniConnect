import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { faculties } from '../data/nsuk-faculties';

const ROLES = ['Student', 'Lecturer', 'Staff'];
const LEVELS = ['100', '200', '300', '400', '500'];

export default function SignUpScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [matricNo, setMatricNo] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Student');
  const [faculty, setFaculty] = useState('');
  const [department, setDepartment] = useState('');
  const [level, setLevel] = useState('');
  const [loading, setLoading] = useState(false);

  const selectedFaculty = useMemo(
    () => faculties.find((f) => f.name === faculty),
    [faculty]
  );

  const departments = selectedFaculty?.departments || [];

  const passwordStrength = useMemo(() => {
    if (password.length === 0) return '';
    if (password.length < 8) return 'Weak';
    if (!/\d/.test(password)) return 'Medium';
    return 'Strong · 8+ characters, a number';
  }, [password]);

  const handleGoogleSignUp = () => {
    Alert.alert('Google Sign-In', 'Google OAuth will be integrated here (Expo AuthSession + Google).');
  };

  const handleCreateAccount = async () => {
    if (!fullName || !email || !password) {
      Alert.alert('Missing fields', 'Please fill in all required fields.');
      return;
    }
    if (role === 'Student' && (!faculty || !department || !level)) {
      Alert.alert('Incomplete', 'Students must select faculty, department and level.');
      return;
    }

    setLoading(true);
    try {
      // TODO: Call backend POST /auth/signup
      // For now, simulate success
      await new Promise((r) => setTimeout(r, 800));
      Alert.alert('Success', 'Account created! Please verify your email or continue to verification.');
      router.replace('/(tabs)'); // or home after auth
    } catch (e) {
      Alert.alert('Error', 'Could not create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.logo}>UniConnect</Text>
        <Text style={styles.title}>Create your account</Text>
        <Text style={styles.subtitle}>Nasarawa State University, Keffi</Text>

        <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignUp}>
          <Text style={styles.googleText}>Continue with Google</Text>
        </TouchableOpacity>

        <Text style={styles.orText}>or use email</Text>

        <TextInput
          style={styles.input}
          placeholder="Full name"
          value={fullName}
          onChangeText={setFullName}
          autoCapitalize="words"
        />
        <TextInput
          style={styles.input}
          placeholder="Matric no. (e.g. NSU/CSC/...)"
          value={matricNo}
          onChangeText={setMatricNo}
          autoCapitalize="characters"
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {passwordStrength ? (
          <Text style={[styles.strength, passwordStrength.startsWith('Strong') && styles.strengthGood]}>
            {passwordStrength}
          </Text>
        ) : null}

        <Text style={styles.sectionLabel}>I am a</Text>
        <View style={styles.roleRow}>
          {ROLES.map((r) => (
            <TouchableOpacity
              key={r}
              style={[styles.roleButton, role === r && styles.roleButtonActive]}
              onPress={() => setRole(r)}
            >
              <Text style={[styles.roleText, role === r && styles.roleTextActive]}>{r}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionLabel}>Faculty</Text>
        <View style={styles.pickerContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {faculties.map((f) => (
              <TouchableOpacity
                key={f.name}
                style={[styles.chip, faculty === f.name && styles.chipActive]}
                onPress={() => {
                  setFaculty(f.name);
                  setDepartment('');
                }}
              >
                <Text style={[styles.chipText, faculty === f.name && styles.chipTextActive]}>
                  {f.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {faculty ? (
          <>
            <Text style={styles.sectionLabel}>
              Department · {departments.length} in this faculty
            </Text>
            <View style={styles.chipWrap}>
              {departments.map((d) => (
                <TouchableOpacity
                  key={d}
                  style={[styles.chip, department === d && styles.chipActive]}
                  onPress={() => setDepartment(d)}
                >
                  <Text style={[styles.chipText, department === d && styles.chipTextActive]}>
                    {d}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        ) : null}

        <Text style={styles.sectionLabel}>Level</Text>
        <View style={styles.levelRow}>
          {LEVELS.map((lv) => (
            <TouchableOpacity
              key={lv}
              style={[styles.levelButton, level === lv && styles.levelButtonActive]}
              onPress={() => setLevel(lv)}
            >
              <Text style={[styles.levelText, level === lv && styles.levelTextActive]}>{lv}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.createButton, loading && styles.createButtonDisabled]}
          onPress={handleCreateAccount}
          disabled={loading}
        >
          <Text style={styles.createButtonText}>
            {loading ? 'Creating...' : 'Create account'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/login')}>
          <Text style={styles.loginLink}>
            Already have an account? <Text style={styles.loginLinkBold}>Log in</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  container: { padding: 20, paddingBottom: 40 },
  logo: { fontSize: 28, fontWeight: '700', color: '#0d7a4f', textAlign: 'center', marginTop: 10 },
  title: { fontSize: 22, fontWeight: '700', textAlign: 'center', marginTop: 8 },
  subtitle: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 20 },
  googleButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  googleText: { fontSize: 16, fontWeight: '600' },
  orText: { textAlign: 'center', color: '#888', marginVertical: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 12,
    backgroundColor: '#fafafa',
  },
  strength: { fontSize: 13, color: '#c0392b', marginBottom: 12, marginTop: -6 },
  strengthGood: { color: '#0d7a4f' },
  sectionLabel: { fontSize: 15, fontWeight: '600', marginTop: 16, marginBottom: 8 },
  roleRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  roleButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  roleButtonActive: { backgroundColor: '#0d7a4f', borderColor: '#0d7a4f' },
  roleText: { fontWeight: '600', color: '#333' },
  roleTextActive: { color: '#fff' },
  pickerContainer: { marginBottom: 8 },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  chipActive: { backgroundColor: '#0d7a4f', borderColor: '#0d7a4f' },
  chipText: { fontSize: 14, color: '#333' },
  chipTextActive: { color: '#fff', fontWeight: '600' },
  levelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  levelButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelButtonActive: { backgroundColor: '#0d7a4f', borderColor: '#0d7a4f' },
  levelText: { fontWeight: '700', color: '#333' },
  levelTextActive: { color: '#fff' },
  createButton: {
    backgroundColor: '#0d7a4f',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  createButtonDisabled: { opacity: 0.6 },
  createButtonText: { color: '#fff', fontSize: 17, fontWeight: '700' },
  loginLink: { textAlign: 'center', color: '#666', fontSize: 15 },
  loginLinkBold: { color: '#0d7a4f', fontWeight: '700' },
});
