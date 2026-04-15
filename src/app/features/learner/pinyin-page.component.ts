import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { IconComponent } from '../../shared/icon/icon.component';

type CurriculumStepId = 'syllable' | 'tones' | 'contrasts' | 'speech';

type ToneCard = {
  id: string;
  title: string;
  mark: string;
  contour: string;
  description: string;
  example: string;
  coaching: string;
};

type CurriculumStep = {
  id: CurriculumStepId;
  title: string;
  description: string;
  icon: string;
};

type SyllablePart = {
  label: string;
  explanation: string;
  examples: string;
  focus: string;
};

type InitialGroup = {
  family: string;
  examples: string[];
  articulation: string;
  contrast: string;
};

type FinalGroup = {
  family: string;
  examples: string[];
  cue: string;
  sample: string;
};

type ToneRule = {
  title: string;
  summary: string;
  examples: string;
  reminder: string;
};

type PracticeExample = {
  hanzi: string;
  pinyin: string;
  meaning: string;
  tip: string;
};

@Component({
  selector: 'app-pinyin-page',
  imports: [RouterLink, IconComponent],
  templateUrl: './pinyin-page.component.html',
  styleUrl: './pinyin-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PinyinPageComponent {
  readonly selectedStepId = signal<CurriculumStepId>('syllable');

  readonly curriculumSteps: CurriculumStep[] = [
    {
      id: 'syllable',
      title: '1. Build the syllable skeleton',
      description: 'Learn that each syllable is built from an optional initial, a final, and a tone. Do not start with full sentences.',
      icon: 'schema'
    },
    {
      id: 'tones',
      title: '2. Lock in the tone contour',
      description: 'Practice the four main tones and the neutral tone slowly until the pitch pattern stays stable without reading support.',
      icon: 'stacked_line_chart'
    },
    {
      id: 'contrasts',
      title: '3. Contrast similar sounds',
      description: 'Train pairs that learners confuse most often, especially zh/ch/sh/r versus j/q/x and u versus ü.',
      icon: 'compare_arrows'
    },
    {
      id: 'speech',
      title: '4. Move into connected speech',
      description: 'Only after isolated syllables are clear should you practice tone changes, neutral tone, and short phrases.',
      icon: 'lyrics'
    }
  ];

  readonly syllableParts: SyllablePart[] = [
    {
      label: 'Initial',
      explanation: 'The opening consonant sets the mouth position and airflow. Some syllables begin directly with the final and have no initial at all.',
      examples: 'm in mā, x in xué, none in ài',
      focus: 'Teach place of articulation before speed so learners can feel where the sound begins.'
    },
    {
      label: 'Final',
      explanation: 'The final carries the vowel or ending of the syllable. It gives the tone a stable sound shape to sit on.',
      examples: 'a in mā, üe in xué, ong in zhōng',
      focus: 'A weak or unclear final usually makes the tone sound weak too.'
    },
    {
      label: 'Tone',
      explanation: 'The tone changes meaning. It must be learned together with the syllable rather than added later.',
      examples: 'mā, má, mǎ, mà',
      focus: 'Ask learners to repeat the full syllable with its tone contour, not the consonant and vowel separately.'
    },
    {
      label: 'Rhythm',
      explanation: 'Natural Mandarin timing alternates between full syllables and lighter unstressed ones in common words and phrases.',
      examples: 'māma, xièxie, péngyou',
      focus: 'Learners should hear that some syllables are lighter without losing clarity.'
    }
  ];

  readonly toneCards: ToneCard[] = [
    {
      id: 'tone-1',
      title: 'First Tone',
      mark: 'mā',
      contour: 'High and level',
      description: 'Hold the pitch steady and bright, as if sustaining one clean musical note.',
      example: 'shū, tiān, gāo',
      coaching: 'Keep the vowel open and even. If the pitch drops, the tone stops sounding complete.'
    },
    {
      id: 'tone-2',
      title: 'Second Tone',
      mark: 'má',
      contour: 'Rising',
      description: 'Start mid and glide upward, similar to the pitch pattern used in a short question.',
      example: 'xué, shéi, lái',
      coaching: 'Do not begin too low. The rise should feel smooth rather than like a sudden jump.'
    },
    {
      id: 'tone-3',
      title: 'Third Tone',
      mark: 'mǎ',
      contour: 'Dip then rise',
      description: 'Let the voice sink before it lifts. In connected speech it is often shortened, but keep the low dip.',
      example: 'hǎo, wǒ, xiǎo',
      coaching: 'In isolation, complete the full dip. In phrases, learners still need to hear the low point clearly.'
    },
    {
      id: 'tone-4',
      title: 'Fourth Tone',
      mark: 'mà',
      contour: 'Sharp falling',
      description: 'Drop with purpose, like a firm command. It should feel decisive rather than heavy.',
      example: 'qù, kàn, xiè',
      coaching: 'Begin high enough that the drop is audible. A flat fourth tone usually sounds weak or uncertain.'
    },
    {
      id: 'tone-0',
      title: 'Neutral Tone',
      mark: 'ma',
      contour: 'Light and unstressed',
      description: 'The neutral tone is short and soft. Its pitch depends on the syllable before it rather than carrying a full tone shape.',
      example: 'māma, xièxie, nǐmen',
      coaching: 'Do not give it the same weight as a full tone. The rhythm should feel lighter immediately.'
    }
  ];

  readonly initialGroups: InitialGroup[] = [
    {
      family: 'Lip sounds',
      examples: ['b', 'p', 'm', 'f'],
      articulation: 'Produced with the lips. Start here because the mouth movement is easy to feel and see.',
      contrast: 'b and p differ mainly in aspiration. p releases more air; b stays shorter and tighter.'
    },
    {
      family: 'Tongue-tip sounds',
      examples: ['d', 't', 'n', 'l'],
      articulation: 'Touch the tongue tip just behind the upper teeth ridge, then release cleanly into the vowel.',
      contrast: 'd versus t is another aspiration contrast. n and l require a steady tongue position with different airflow.'
    },
    {
      family: 'Velar sounds',
      examples: ['g', 'k', 'h'],
      articulation: 'These are formed further back in the mouth. Keep the throat relaxed so h does not become harsh.',
      contrast: 'g and k should not drift toward English hard g and k with heavy tension.'
    },
    {
      family: 'Retroflex initials',
      examples: ['zh', 'ch', 'sh', 'r'],
      articulation: 'Curl the tongue slightly back and let the sound resonate deeper in the mouth than fronted consonants.',
      contrast: 'These must stay distinct from j, q, x. If the sound is too far forward, the contrast disappears.'
    },
    {
      family: 'Alveolar sibilants',
      examples: ['z', 'c', 's'],
      articulation: 'Keep the tongue forward and the airflow narrow. They are sharper and more frontal than retroflex sounds.',
      contrast: 'c is strongly aspirated. z is unaspirated. s should stay narrow and bright.'
    },
    {
      family: 'Alveolo-palatal initials',
      examples: ['j', 'q', 'x'],
      articulation: 'Flatten the tongue toward the front roof of the mouth and keep the sound lighter and more forward than zh/ch/sh.',
      contrast: 'q is aspirated, j is not, and x should stay frictional without turning into an English sh.'
    }
  ];

  readonly finalGroups: FinalGroup[] = [
    {
      family: 'Simple finals',
      examples: ['a', 'o', 'e', 'i', 'u', 'ü'],
      cue: 'Stabilize each single vowel clearly before moving into compound finals or full words.',
      sample: 'ma, mo, de, mi, tu, nü'
    },
    {
      family: 'Compound finals',
      examples: ['ai', 'ei', 'ao', 'ou'],
      cue: 'Let the vowel glide smoothly from one target to the next instead of splitting it into two separate syllables.',
      sample: 'bái, méi, hǎo, dōu'
    },
    {
      family: 'Nasal finals',
      examples: ['an', 'en', 'ang', 'eng', 'ong'],
      cue: 'Close the syllable cleanly. Learners often blur -n and -ng, so train them as separate mouth endings.',
      sample: 'kàn, mén, cháng, dēng, zhōng'
    },
    {
      family: 'Front rounded finals',
      examples: ['üe', 'üan', 'ün'],
      cue: 'Shape the lips for ü early and hold the rounding through the whole final.',
      sample: 'xué, juān, qún'
    },
    {
      family: 'Apical vowel syllables',
      examples: ['zi', 'ci', 'si', 'zhi', 'chi', 'shi', 'ri'],
      cue: 'These spellings use i, but the sound is not the same as the plain vowel in mi or li.',
      sample: 'zì, cì, sì, zhī, chī, shí, rì'
    }
  ];

  readonly toneRules: ToneRule[] = [
    {
      title: 'Third tone before another third tone',
      summary: 'The first third tone changes to a rising second tone in common connected speech.',
      examples: 'nǐ hǎo -> ní hǎo, lǎo shǔ -> láo shǔ',
      reminder: 'The second syllable keeps the low third-tone shape. Only the first syllable changes.'
    },
    {
      title: 'Tone on yi',
      summary: '一 changes tone depending on the word that follows in connected speech.',
      examples: 'yì ge, yí yàng, yì zhāng, yí tiān',
      reminder: 'Treat dictionary form as reference only. In phrases, match the spoken tone rule.'
    },
    {
      title: 'Tone on bu',
      summary: '不 changes from fourth tone to second tone before another fourth-tone syllable.',
      examples: 'bú shì, bú yào, bú qù',
      reminder: 'If the next syllable is not fourth tone, keep bù as fourth tone.'
    },
    {
      title: 'Neutral tone rhythm',
      summary: 'Some common second syllables lose full stress and become light in everyday speech.',
      examples: 'māma, bàba, xièxie, péngyou',
      reminder: 'Shorten the second syllable and reduce the pitch movement instead of pronouncing two full strong syllables.'
    }
  ];

  readonly practiceExamples: PracticeExample[] = [
    {
      hanzi: '你好',
      pinyin: 'nǐ hǎo',
      meaning: 'Hello',
      tip: 'Keep both third tones low and rounded; in natural speech the first one often rises slightly before the second.'
    },
    {
      hanzi: '學生',
      pinyin: 'xué shēng',
      meaning: 'Student',
      tip: 'Make the second tone in xué climb cleanly, then reset to a calm first tone for shēng.'
    },
    {
      hanzi: '謝謝',
      pinyin: 'xiè xie',
      meaning: 'Thank you',
      tip: 'The first syllable falls strongly. The second syllable is light and should not receive a full fourth tone.'
    },
    {
      hanzi: '中國',
      pinyin: 'Zhōngguó',
      meaning: 'China',
      tip: 'Contrast the level first tone with the rising second tone. Keep zh distinct from j.'
    },
    {
      hanzi: '不是',
      pinyin: 'bú shì',
      meaning: 'Is not',
      tip: 'Apply the tone-change rule on 不 before the fourth tone on shì. The first syllable should rise, not fall.'
    },
    {
      hanzi: '朋友',
      pinyin: 'péngyou',
      meaning: 'Friend',
      tip: 'Keep the second syllable light. Do not give you a full third tone here in normal speech.'
    },
    {
      hanzi: '去學校',
      pinyin: 'qù xuéxiào',
      meaning: 'Go to school',
      tip: 'The fourth tone on qù should fall cleanly, then reset immediately for the rising xué.'
    }
  ];

  selectStep(stepId: CurriculumStepId): void {
    this.selectedStepId.set(stepId);
  }
}