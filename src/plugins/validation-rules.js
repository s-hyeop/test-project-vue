import { defineRule, configure } from 'vee-validate';

// --- 공통 헬퍼 ---
const isBlank = (v) => v === undefined || v === null || String(v).trim() === '';
const len = (v) => String(v ?? '').length;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASS_RE = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-\=\[\]{};':",.<>\/?]+$/;
const COLOR_RE = /^(red|blue|green|yellow|purple)$/i;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

// 실시간 검증
configure({
  validateOnInput: true,
  validateOnBlur: false,
  validateOnChange: false,
  validateOnModelUpdate: false,
});

// ------------------------
//  email
//  @NotBlank, @Email, @Size(max=300)
// ------------------------
defineRule('rule-email', (value) => {
  const v = String(value ?? '');

  if (isBlank(v)) {
    return '이메일은 비어 있을 수 없습니다.';
  }

  if (len(v) > 300) {
    return '이메일은 300자 이하여야 합니다.';
  }

  if (!EMAIL_RE.test(v)) {
    return '올바른 이메일 형식이어야 합니다.';
  }

  return true;
});

// ------------------------
//  password
//  @NotBlank, @Size(6~72), @Pattern(영문+숫자 포함, 허용문자 집합)
// ------------------------
defineRule('rule-password', (value) => {
  const v = String(value ?? '');

  if (isBlank(v)) {
    return '비밀번호는 비어 있을 수 없습니다.';
  }

  if (len(v) < 6 || len(v) > 72) {
    return '비밀번호는 6자 이상 72자 이하여야 합니다.';
  }

  if (!PASS_RE.test(v)) {
    return '비밀번호는 영문과 숫자를 반드시 포함해야 합니다.';
  }

  return true;
});

defineRule('rule-confirmPassword', (value, params, ctx) => {
  const targetField = params?.[0] || 'password';
  const v = String(value ?? '');

  if (isBlank(v)) {
    return '비밀번호 확인을 입력해주세요.';
  }

  const pwd = String(ctx.form?.[targetField] ?? '');
  if (v !== pwd) {
    return '비밀번호가 일치하지 않습니다.';
  }

  return true;
});

// ------------------------
//  username
//  @NotBlank, @Size(2~30)
// ------------------------
defineRule('rule-username', (value) => {
  const v = String(value ?? '');

  if (isBlank(v)) {
    return '이름은 비어 있을 수 없습니다.';
  }

  if (len(v) < 2 || len(v) > 30) {
    return '이름은 2자 이상 30자 이하여야 합니다.';
  }

  return true;
});

// ------------------------
//  todoTitle
//  @NotBlank, @Size(max=100)
// ------------------------
defineRule('rule-todoTitle', (value) => {
  const v = String(value ?? '');

  if (isBlank(v)) {
    return '제목은 비어 있을 수 없습니다.';
  }

  if (len(v) > 100) {
    return '제목은 100자 이하여야 합니다.';
  }

  return true;
});

// ------------------------
//  todoContent
//  @NotBlank, @Size(max=1000)
// ------------------------
defineRule('rule-todoContent', (value) => {
  const v = String(value ?? '');

  if (isBlank(v)) {
    return '내용은 비어 있을 수 없습니다.';
  }

  if (len(v) > 1000) {
    return '내용은 1000자 이하여야 합니다.';
  }

  return true;
});

// ------------------------
//  todoColor
//  @Pattern(red|blue|green|yellow|purple)  (*필수 아님)
// ------------------------
defineRule('rule-todoColor', (value) => {
  const v = String(value ?? '');

  if (isBlank(v)) {
    return '색상을 선택해주세요.';
  }

  if (!COLOR_RE.test(v)) {
    return '색상은 red, blue, green, yellow, purple 중 하나여야 합니다.';
  }

  return true;
});

// ------------------------
//  todoDueAt
//  @NotNull  (+ 날짜 형식 보정: YYYY-MM-DD 권장)
// ------------------------
defineRule('rule-todoDueAt', (value) => {
  const v = String(value ?? '');

  if (isBlank(v)) {
    return '마감일은 비어 있을 수 없습니다.';
  }

  if (!DATE_RE.test(v)) {
    return '유효한 날짜(YYYY-MM-DD)여야 합니다.';
  }

  const d = new Date(v + 'T00:00:00');

  if (Number.isNaN(d.getTime())) {
    return '유효한 날짜(YYYY-MM-DD)여야 합니다.';
  }

  return true;
});

// ------------------------
//  todoSequence
//  @NotNull (+ 정수 체크)
// ------------------------
defineRule('rule-todoSequence', (value) => {
  if (value === undefined || value === null || String(value) === '') {
    return '순서는 비어 있을 수 없습니다.';
  }

  const n = Number(value);

  if (!Number.isInteger(n)) {
    return '순서는 정수여야 합니다.';
  }

  return true;
});
