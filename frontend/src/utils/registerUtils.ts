import axios from '../api/axios';

// 타입 정의
export interface RegisterForm {
    username: string;
    password: string;
    confirmPassword: string;
    name: string;
    email: string;
    phone1: string;
    phone2: string;
    phone3: string;
    address: string;
    addressDetail: string;
    birthYear: string;
    birthMonth: string;
    birthDay: string;
}

export interface RegisterErrors {
    username: string;
    password: string;
    confirmPassword: string;
    email: string;
    birthDate: string;
    address: string;
}

export interface RegisterTouched {
    username: boolean;
    password: boolean;
    confirmPassword: boolean;
    email: boolean;
    birthDate: boolean;
    address: boolean;
}

// 아이디 중복 체크 함수
export const checkUsernameAvailability = async (
    username: string,
    setUsernameChecking: (checking: boolean) => void,
    setUsernameAvailable: (available: boolean | null) => void,
    setErrors: (errors: RegisterErrors) => void,
    errors: RegisterErrors
) => {
    if (username.length < 7) {
        setErrors({
            ...errors,
            username: '아이디는 7자 이상이어야 합니다.'
        });
        return;
    }
    
    setUsernameChecking(true);
    
    try {
        const response = await axios.get(`/users/check-username/${username}`);
        const { exists } = response.data;
        
        setUsernameAvailable(!exists);
        
        if (exists) {
            setErrors({
                ...errors,
                username: '이미 사용 중인 아이디입니다.'
            });
        } else {
            setErrors({
                ...errors,
                username: ''
            });
        }
    } catch (error) {
        console.error('아이디 중복 확인 중 오류 발생:', error);
        setErrors({
            ...errors,
            username: '중복 확인 중 오류가 발생했습니다.'
        });
    } finally {
        setUsernameChecking(false);
    }
};

// 주소 선택 완료 함수
export const handleAddressComplete = (
    data: any,
    setForm: (form: any) => void,
    form: RegisterForm,
    setOpen: (open: boolean) => void,
    setErrors: (errors: RegisterErrors) => void,
    errors: RegisterErrors,
    setTouched: (touched: RegisterTouched) => void,
    touched: RegisterTouched,
    validateForm: () => void
) => {
    // 주소가 입력되면 주소 에러 메시지 초기화
    setErrors({
        ...errors,
        address: ''
    });
    
    // 주소 필드를 터치한 것으로 표시 (먼저 설정)
    setTouched({
        ...touched,
        address: true
    });
    
    // 폼 상태 업데이트
    setForm({ 
        ...form, 
        address: data.address 
    });
    
    // 주소 검색 창 닫기
    setOpen(false);
    
    // 즉시 유효성 검사 실행
    validateForm();
    
    // 상태 업데이트가 완전히 반영된 후 다시 한번 유효성 검사 실행
    setTimeout(() => {
        console.log('Running delayed validation after address complete');
        validateForm();
    }, 300);
};

// 전화번호 입력 필드 자동 이동 함수
export const handlePhoneInputChange = (
    field: string,
    value: string,
    maxLength: number,
    setForm: (form: any) => void,
    form: RegisterForm,
    touched: RegisterTouched,
    validateForm: () => void,
    nextRef?: React.RefObject<HTMLInputElement>
) => {
    // 숫자만 입력 가능하도록 필터링
    const numericValue = value.replace(/[^0-9]/g, '');
    
    // 최대 길이 제한
    const truncatedValue = numericValue.slice(0, maxLength);
    
    setForm({
        ...form,
        [field]: truncatedValue
    });
    
    // 최대 길이에 도달하면 다음 필드로 포커스 이동
    if (truncatedValue.length === maxLength && nextRef && nextRef.current) {
        nextRef.current.focus();
    }
    
    // 필드가 이미 터치되었으면 즉시 유효성 검사
    if (touched[field as keyof typeof touched]) {
        setTimeout(() => validateForm(), 0);
    }
};

// 폼 유효성 검사 함수
export const validateForm = (
    form: RegisterForm,
    touched: RegisterTouched,
    usernameAvailable: boolean | null,
    setErrors: (errors: RegisterErrors) => void,
    setIsFormValid: (isValid: boolean) => void
): boolean => {
    const newErrors: RegisterErrors = {
        username: '',
        password: '',
        confirmPassword: '',
        email: '',
        birthDate: '',
        address: ''
    };
          
    // 아이디 검증 - 터치된 경우에만 오류 메시지 표시
    if (touched.username) {
        if (form.username.length === 0) {
            newErrors.username = '아이디를 입력해주세요.';
        } else if (form.username.length < 7) {
            newErrors.username = '아이디는 7자 이상이어야 합니다.';
        } else if (usernameAvailable === false) {
            newErrors.username = '이미 사용 중인 아이디입니다.';
        }
    }
    
    // 비밀번호 검증 - 터치된 경우에만 오류 메시지 표시
    if (touched.password) {
        if (form.password.length === 0) {
            newErrors.password = '비밀번호를 입력해주세요.';
        } else if (form.password.length < 8) {
            newErrors.password = '비밀번호는 8자 이상이어야 합니다.';
        }
    }
    
    // 비밀번호 확인 검증 - 터치된 경우에만 오류 메시지 표시
    if (touched.confirmPassword) {
        if (form.confirmPassword.length === 0) {
            newErrors.confirmPassword = '비밀번호 확인을 입력해주세요.';
        } else if (form.password !== form.confirmPassword) {
            newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
        }
    }
    
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (touched.email && form.email.length > 0 && !emailPattern.test(form.email)) {
        newErrors.email = '유효한 이메일 주소를 입력하세요.';
    }
        
    // 생년월일 유효성 검사 - 값이 있는 경우만 검증
    if (form.birthYear && form.birthMonth && form.birthDay) {
        const birthYear = parseInt(form.birthYear);
        const birthMonth = parseInt(form.birthMonth);
        const birthDay = parseInt(form.birthDay);
        
        const birthDate = new Date(birthYear, birthMonth - 1, birthDay);
        const now = new Date();
        
        if (
            birthDate.getFullYear() !== birthYear || 
            birthDate.getMonth() !== birthMonth - 1 || 
            birthDate.getDate() !== birthDay ||
            birthYear < 1900 || 
            birthYear > now.getFullYear()
        ) {
            newErrors.birthDate = '유효한 생년월일을 입력하세요.';
        }
    }
    
    // 주소 검증 - 터치된 경우에만 오류 메시지 표시
    if (touched.address && !form.address) {
        newErrors.address = '주소 검색을 통해 주소를 입력해주세요.';
    }

    setErrors(newErrors);
    
    // 각 필드의 유효성 여부 계산 (터치 여부와 관계없이)
    const isUsernameValid = form.username.length >= 7 && usernameAvailable === true;
    const isPasswordValid = form.password.length >= 8;
    const isPasswordConfirmValid = form.password === form.confirmPassword && form.confirmPassword.length > 0;
    const isNameValid = form.name.length > 0;
    const isEmailValid = form.email.length === 0 || emailPattern.test(form.email);
    const isPhoneValid = form.phone1.length > 0 && form.phone2.length > 0 && form.phone3.length > 0;
    const isAddressValid = form.address.length > 0;
    
    // 제출 버튼 활성화 여부 검사 - 모든 필수 필드가 유효한지 확인
    const isValid = 
        isUsernameValid && 
        isPasswordValid && 
        isPasswordConfirmValid && 
        isNameValid && 
        isEmailValid && 
        isPhoneValid && 
        isAddressValid;
    
    console.log('Form validation result:', {
        isUsernameValid,
        isPasswordValid,
        isPasswordConfirmValid,
        isNameValid,
        isEmailValid,
        isPhoneValid,
        isAddressValid,
        isFormValid: isValid,
        address: form.address
    });
    
    setIsFormValid(isValid);
    return Object.keys(newErrors).filter(key => newErrors[key as keyof RegisterErrors]).length === 0;
};

// 입력 필드 값 변경 함수
export const handleInputChange = (
    field: string,
    value: string,
    setForm: (form: any) => void,
    form: RegisterForm,
    touched: RegisterTouched,
    setUsernameAvailable: (available: boolean | null) => void,
    validateForm: () => void
) => {
    // 아이디 필드 변경 시 중복확인 상태 초기화
    if (field === 'username') {
        setUsernameAvailable(null);
    }
    
    setForm({
        ...form,
        [field]: value
    });
    
    // 필드가 이미 터치되었으면 즉시 유효성 검사
    if (touched[field as keyof typeof touched]) {
        setTimeout(() => validateForm(), 0);
    }
};

// 회원가입 처리 함수
export const handleRegister = async (
    form: RegisterForm,
    navigate: any,
    setTouched: (touched: RegisterTouched) => void,
    validateForm: () => boolean,
    usernameAvailable: boolean | null
) => {
    // 모든 필드를 터치된 상태로 설정
    const allTouched: RegisterTouched = {
        username: true,
        password: true,
        confirmPassword: true,
        email: true,
        birthDate: true,
        address: true,
    };
    setTouched(allTouched);
    
    if (!validateForm()) return;
    
    // 아이디 중복 확인이 되지 않은 경우
    if (usernameAvailable !== true) {
        alert('아이디 중복 확인을 해주세요.');
        return;
    }
    
    // 주소가 입력되지 않은 경우
    if (!form.address) {
        alert('주소 검색을 통해 주소를 입력해주세요.');
        return;
    }
    
    const fullPhone = form.phone1 + '-' + form.phone2 + '-' + form.phone3;
    const birthDate = form.birthYear && form.birthMonth && form.birthDay 
        ? `${form.birthYear}-${form.birthMonth.padStart(2, '0')}-${form.birthDay.padStart(2, '0')}` 
        : '';
    
    const userData = {
        username: form.username,
        password: form.password,
        name: form.name,
        email: form.email,
        phone: fullPhone,
        address: form.address + ' ' + form.addressDetail,
        birthDate
    };
    
    try {
        const res = await axios.post('/users/register', userData);
        alert(res.data);
        navigate('/login');
    } catch (err: any) {
        alert('회원가입 실패: ' + err.response?.data || '');
    }
};

// 필수 항목 표시를 위한 데이터 생성 함수
export const getOptionsData = () => {
    // 년도 옵션 생성
    const currentYear = new Date().getFullYear();
    const yearOptions = Array.from({ length: 100 }, (_, i) => currentYear - i);
    
    // 월 옵션
    const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1);
    
    // 일 옵션
    const dayOptions = Array.from({ length: 31 }, (_, i) => i + 1);
    
    return { yearOptions, monthOptions, dayOptions };
}; 