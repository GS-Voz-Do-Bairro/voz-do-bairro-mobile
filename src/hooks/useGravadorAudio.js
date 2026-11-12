import { useCallback, useState } from 'react';
import {
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
  useAudioRecorder,
  useAudioRecorderState,
} from 'expo-audio';

export const DURACAO_MAXIMA_MS = 2 * 60 * 1000;

export function useGravadorAudio() {
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const estado = useAudioRecorderState(recorder, 250);
  const [uri, setUri] = useState(null);
  const [duracaoFinal, setDuracaoFinal] = useState(0);
  const player = useAudioPlayer(uri);
  const statusPlayer = useAudioPlayerStatus(player);

  const iniciar = useCallback(async () => {
    const permissao = await requestRecordingPermissionsAsync();
    if (!permissao.granted) return false;
    await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
    setUri(null);
    await recorder.prepareToRecordAsync();
    recorder.record();
    return true;
  }, [recorder]);

  const parar = useCallback(async () => {
    const duracao = estado.durationMillis;
    await recorder.stop();
    await setAudioModeAsync({ allowsRecording: false, playsInSilentMode: true });
    setDuracaoFinal(duracao);
    setUri(recorder.uri);
    return recorder.uri;
  }, [recorder, estado.durationMillis]);

  const alternarReproducao = useCallback(() => {
    if (statusPlayer.playing) {
      player.pause();
      return;
    }
    if (statusPlayer.didJustFinish || statusPlayer.currentTime >= statusPlayer.duration) player.seekTo(0);
    player.play();
  }, [player, statusPlayer]);

  const descartar = useCallback(() => {
    if (statusPlayer.playing) player.pause();
    setUri(null);
    setDuracaoFinal(0);
  }, [player, statusPlayer.playing]);

  return {
    gravando: estado.isRecording,
    duracaoMs: estado.isRecording ? estado.durationMillis : duracaoFinal,
    uri,
    reproduzindo: statusPlayer.playing,
    iniciar,
    parar,
    alternarReproducao,
    descartar,
  };
}
