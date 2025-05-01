import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import LectureSidebar from '../components/LectureSidebar.tsx';
import NoticeSection from '../components/lecture/NoticeSection';
import QnaSection from '../components/lecture/QnaSection';
import ReviewSection from '../components/lecture/ReviewSection';
import ContentSection from '../components/lecture/ContentSection';
import ResourcesSection from '../components/lecture/ResourcesSection.tsx';
import './LectureDetail.css';
import {
    Lecture,
    Notice,
    NewNotice,
    LectureQna,
    NewQuestion,
    LectureReview,
    NewReview,
    Resource,
    fetchLecture,
    fetchNotices,
    createNotice,
    updateNotice,
    deleteNotice,
    fetchQnas,
    createQuestion,
    answerQuestion,
    deleteQna,
    fetchReviews,
    createReview,
    updateReview,
    deleteReview,
    fetchResources,
    uploadResource,
    deleteResource,
    isAdmin,
    getCurrentUser,
    isLoggedIn,
} from '../utils/LectureDetailUtils';

const LectureDetail: React.FC = () => {
    const { id } = useParams();
    const [lecture, setLecture] = useState<Lecture | null>(null);
    const [notices, setNotices] = useState<Notice[]>([]);
    const [qnas, setQnas] = useState<LectureQna[]>([]);
    const [reviews, setReviews] = useState<LectureReview[]>([]);
    const [resources,setResources] = useState<Resource[]>([]);

    const [activeSection, setActiveSection] = useState<string>('contents');
    const [newNotice, setNewNotice] = useState<NewNotice>({ title: '', content: '' });
    const [newQuestion, setNewQuestion] = useState<NewQuestion>({ author: getCurrentUser(), question: '' });
    const [newReview, setNewReview] = useState<NewReview>({ title: '', content: '' });
    const [answer, setAnswer] = useState<string>('');
    const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
    const [selectedQna, setSelectedQna] = useState<LectureQna | null>(null);
    const [selectedReview, setSelectedReview] = useState<LectureReview | null>(null);
    const [isWriting, setIsWriting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isAskingQuestion, setIsAskingQuestion] = useState(false);
    const [isAnswering, setIsAnswering] = useState(false);
    const [isWritingReview, setIsWritingReview] = useState(false);
    const [isEditingReview, setIsEditingReview] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // 자료실 업로드
    const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    
    const userIsAdmin = isAdmin();

    useEffect(() => {
        const loadLecture = async () => {
            if (!id) return;

            try {
                setIsLoading(true);
                const lectureData = await fetchLecture(id);
                setLecture(lectureData);

                await Promise.all([
                    loadNotices(lectureData.id),
                    loadQnas(lectureData.id),
                    loadReviews(lectureData.id),
                    loadResources(lectureData.id)
                ]);
            } catch (error) {
                alert('강의 정보를 불러오지 못했습니다.');
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        loadLecture();
    }, [id]);

    useEffect(() => {
        if (!lecture?.id) return;
        fetchResources(lecture.id).then(setResources);
    }, [lecture?.id]);

    const loadNotices = async (lectureId: number) => {
        try {
            const noticeData = await fetchNotices(lectureId);
            setNotices(noticeData);
        } catch (error) {
            console.error('공지사항 로딩 실패', error);
        }
    };
    
    const loadQnas = async (lectureId: number) => {
        try {
            const qnaData = await fetchQnas(lectureId);
            setQnas(qnaData);
        } catch (error) {
            console.error('Q&A 로딩 실패', error);
        }
    };
    
    const loadReviews = async (lectureId: number) => {
        try {
            const reviewData = await fetchReviews(lectureId);
            setReviews(reviewData);
        } catch (error) {
            console.error('리뷰 로딩 실패', error);
        }
    };
    
    const handleSectionChange = (section: string) => {
        setActiveSection(section);
        setSelectedNotice(null);
        setSelectedQna(null);
        setSelectedReview(null);
        setIsWriting(false);
        setIsEditing(false);
        setIsAskingQuestion(false);
        setIsAnswering(false);
        setIsWritingReview(false);
        setIsEditingReview(false);
    };
    
    // Notice 관련 핸들러
    const handleCreateNotice = async () => {
        if (!newNotice.title || !newNotice.content) {
            alert('제목과 내용을 모두 입력해주세요.');
            return;
        }
        
        if (!lecture?.id) {
            alert('강의 정보가 없습니다.');
            return;
        }

        try {
            await createNotice(lecture.id, newNotice);
            setNewNotice({ title: '', content: '' });
            setIsWriting(false);
            await loadNotices(lecture.id);
        } catch (e: any) {
            const errorMsg = e.message || '공지사항 등록에 실패했습니다.';
            alert(errorMsg);
        }
    };

    const handleUpdateNotice = async () => {
        if (!newNotice.title || !newNotice.content) {
            alert('제목과 내용을 모두 입력해주세요.');
            return;
        }
        
        if (!lecture?.id || !selectedNotice?.id) {
            alert('강의 또는 공지사항 정보가 없습니다.');
            return;
        }

        try {
            await updateNotice(lecture.id, selectedNotice.id, newNotice);
            setNewNotice({ title: '', content: '' });
            setIsEditing(false);
            setSelectedNotice(null);
            await loadNotices(lecture.id);
        } catch (e: any) {
            const errorMsg = e.message || '공지사항 수정에 실패했습니다.';
            alert(errorMsg);
        }
    };
    
    const handleDeleteNotice = async (noticeId: number) => {
        if (!lecture?.id) {
            alert('강의 정보가 없습니다.');
            return;
        }
        
        const confirmed = window.confirm('정말로 이 공지사항을 삭제하시겠습니까?');
        if (!confirmed) return;
        
        try {
            await deleteNotice(lecture.id, noticeId);
            setSelectedNotice(null);
            await loadNotices(lecture.id);
        } catch (e: any) {
            const errorMsg = e.message || '공지사항 삭제에 실패했습니다.';
            alert(errorMsg);
        }
    };

    const handleNoticeClick = (notice: Notice) => {
        setSelectedNotice(notice);
        setIsEditing(false);
    };
    
    const handleWriteClick = () => {
        if (!userIsAdmin) {
            alert('관리자만 공지사항을 작성할 수 있습니다.');
            return;
        }
        
        setIsWriting(true);
        setSelectedNotice(null);
        setIsEditing(false);
    };
    
    const handleEditClick = () => {
        if (!selectedNotice) return;
        
        if (!userIsAdmin) {
            alert('관리자만 공지사항을 수정할 수 있습니다.');
            return;
        }
        
        setIsEditing(true);
        setNewNotice({
            title: selectedNotice.title,
            content: selectedNotice.content
        });
    };
    
    const handleCancelWrite = () => {
        setIsWriting(false);
        setIsEditing(false);
        setNewNotice({ title: '', content: '' });
    };
    
    // QnA 관련 핸들러
    const handleAskQuestion = async () => {
        if (!newQuestion.question.trim()) {
            alert('질문 내용을 입력해주세요.');
            return;
        }
        
        if (!lecture?.id) {
            alert('강의 정보가 없습니다.');
            return;
        }

        try {
            await createQuestion(lecture.id, {
                ...newQuestion,
                author: getCurrentUser()
            });
            setNewQuestion({ author: getCurrentUser(), question: '' });
            setIsAskingQuestion(false);
            await loadQnas(lecture.id);
        } catch (e: any) {
            const errorMsg = e.message || '질문 등록에 실패했습니다.';
            alert(errorMsg);
        }
    };
    
    const handleSubmitAnswer = async () => {
        if (!answer.trim()) {
            alert('답변 내용을 입력해주세요.');
            return;
        }
        
        if (!lecture?.id || !selectedQna?.id) {
            alert('강의 또는 질문 정보가 없습니다.');
            return;
        }

        try {
            await answerQuestion(lecture.id, selectedQna.id, answer);
            setAnswer('');
            setIsAnswering(false);
            setSelectedQna(null);
            await loadQnas(lecture.id);
        } catch (e: any) {
            const errorMsg = e.message || '답변 등록에 실패했습니다.';
            alert(errorMsg);
        }
    };
    
    const handleDeleteQna = async (qnaId: number) => {
        if (!lecture?.id) {
            alert('강의 정보가 없습니다.');
            return;
        }
        
        const confirmed = window.confirm('정말로 이 질문을 삭제하시겠습니까?');
        if (!confirmed) return;
        
        try {
            await deleteQna(lecture.id, qnaId);
            setSelectedQna(null);
            await loadQnas(lecture.id);
        } catch (e: any) {
            const errorMsg = e.message || '질문 삭제에 실패했습니다.';
            alert(errorMsg);
        }
    };
    
    const handleQnaClick = (qna: LectureQna) => {
        setSelectedQna(qna);
        setIsAnswering(false);
    };
    
    const handleAnswerClick = (qna: LectureQna) => {
        setSelectedQna(qna);
        setIsAnswering(true);
    };
    
    const handleCancelAnswer = () => {
        setIsAnswering(false);
        setAnswer('');
    };
    
    const handleAskQuestionClick = () => {
        setIsAskingQuestion(true);
        setSelectedQna(null);
    };
    
    const handleCancelQuestion = () => {
        setIsAskingQuestion(false);
        setNewQuestion({ author: getCurrentUser(), question: '' });
    };
    
    // 리뷰 관련 핸들러
    const handleCreateReview = async () => {
        if (!newReview.title || !newReview.content) {
            alert('제목과 내용을 모두 입력해주세요.');
            return;
        }
        
        if (!lecture?.id) {
            alert('강의 정보가 없습니다.');
            return;
        }

        try {
            await createReview(lecture.id, newReview);
            setNewReview({ title: '', content: '' });
            setIsWritingReview(false);
            await loadReviews(lecture.id);
        } catch (e: any) {
            const errorMsg = e.message || '리뷰 등록에 실패했습니다.';
            alert(errorMsg);
        }
    };

    const handleUpdateReview = async () => {
        if (!newReview.title || !newReview.content) {
            alert('제목과 내용을 모두 입력해주세요.');
            return;
        }
        
        if (!lecture?.id || !selectedReview?.id) {
            alert('강의 또는 리뷰 정보가 없습니다.');
            return;
        }

        try {
            await updateReview(lecture.id, selectedReview.id, newReview);
            setNewReview({ title: '', content: '' });
            setIsEditingReview(false);
            setSelectedReview(null);
            await loadReviews(lecture.id);
        } catch (e: any) {
            const errorMsg = e.message || '리뷰 수정에 실패했습니다.';
            alert(errorMsg);
        }
    };
    
    const handleDeleteReview = async (reviewId: number) => {
        if (!lecture?.id) {
            alert('강의 정보가 없습니다.');
            return;
        }
        
        const confirmed = window.confirm('정말로 이 리뷰를 삭제하시겠습니까?');
        if (!confirmed) return;
        
        try {
            await deleteReview(lecture.id, reviewId);
            setSelectedReview(null);
            await loadReviews(lecture.id);
        } catch (e: any) {
            const errorMsg = e.message || '리뷰 삭제에 실패했습니다.';
            alert(errorMsg);
        }
    };

    const handleReviewClick = (review: LectureReview) => {
        setSelectedReview(review);
        setIsEditingReview(false);
    };
    
    const handleWriteReviewClick = () => {
        if (!isLoggedIn()) {
            alert('로그인 후 리뷰를 작성할 수 있습니다.');
            return;
        }
        
        setIsWritingReview(true);
        setSelectedReview(null);
        setIsEditingReview(false);
    };
    
    const handleEditReviewClick = () => {
        if (!selectedReview) return;
        
        if (selectedReview.author !== getCurrentUser() && !userIsAdmin) {
            alert('본인이 작성한 리뷰만 수정할 수 있습니다.');
            return;
        }
        
        setIsEditingReview(true);
        setNewReview({
            title: selectedReview.title,
            content: selectedReview.content
        });
    };
    
    const handleCancelReview = () => {
        setIsWritingReview(false);
        setIsEditingReview(false);
        setNewReview({ title: '', content: '' });
    };

    // 자료 로딩 함수
    const loadResources = async (lectureId: number) => {
        try {
            const resourceData = await fetchResources(lectureId);
            setResources(resourceData);
        } catch (error) {
            console.error('자료실 로딩 실패', error);
        }
    };

    // 자료 업로드
    const handleUpload = async () => {
        if (!selectedFile || !lecture?.id) return;
        try {
            await uploadResource(lecture.id, selectedFile);
            setSelectedFile(null);
            setIsUploading(false);
            await loadResources(lecture.id); // 업로드 후 목록 다시 불러오기
        } catch (e) {
            alert('자료 업로드 실패');
        }
    };

    // 자료 삭제
    const handleDelete = async (resourceId: number) => {
        if (!lecture?.id) return;
        const confirmDelete = window.confirm('정말로 삭제하시겠습니까?');
        if (!confirmDelete) return;

        try {
            await deleteResource(resourceId);
            await loadResources(lecture.id); // 삭제 후 목록 갱신
            setSelectedResource(null);
        } catch (e) {
            alert('자료 삭제 실패');
        }
    };

    if (isLoading) return (
        <div className="loading-container">
            <p className="loading-text">로딩 중...</p>
        </div>
    );

    if (!lecture) return (
        <div className="loading-container">
            <p className="loading-text">강의 정보가 없습니다</p>
        </div>
    );

    return (
        <div className="lecture-container">
            <div className="lecture-header">
                <h1 className="lecture-title">{lecture.title}</h1>
                <div className="lecture-author-container">
                    <span className="lecture-author-badge">강사</span>
                    <p className="lecture-author">{lecture.author}</p>
                </div>
                <p className="lecture-description">{lecture.description}</p>
            </div>

            <div className="lecture-content-container">
                <LectureSidebar 
                    lectureId={lecture.id} 
                    notices={notices} 
                    onSectionChange={handleSectionChange} 
                    activeSection={activeSection}
                />
                
                {activeSection === 'notice' && (
                    <NoticeSection
                        notices={notices}
                        selectedNotice={selectedNotice}
                        newNotice={newNotice}
                        isWriting={isWriting}
                        isEditing={isEditing}
                        userIsAdmin={userIsAdmin}
                        onNoticeClick={handleNoticeClick}
                        onWriteClick={handleWriteClick}
                        onEditClick={handleEditClick}
                        onDeleteNotice={handleDeleteNotice}
                        onCancelWrite={handleCancelWrite}
                        onCreateNotice={handleCreateNotice}
                        onUpdateNotice={handleUpdateNotice}
                        setNewNotice={setNewNotice}
                    />
                )}
                
                {activeSection === 'qna' && (
                    <QnaSection
                        qnas={qnas}
                        selectedQna={selectedQna}
                        newQuestion={newQuestion}
                        answer={answer}
                        isAskingQuestion={isAskingQuestion}
                        isAnswering={isAnswering}
                        userIsAdmin={userIsAdmin}
                        onQnaClick={handleQnaClick}
                        onAnswerClick={handleAnswerClick}
                        onAskQuestionClick={handleAskQuestionClick}
                        onCancelQuestion={handleCancelQuestion}
                        onCancelAnswer={handleCancelAnswer}
                        onAskQuestion={handleAskQuestion}
                        onSubmitAnswer={handleSubmitAnswer}
                        onDeleteQna={handleDeleteQna}
                        setNewQuestion={setNewQuestion}
                        setAnswer={setAnswer}
                        getCurrentUser={getCurrentUser}
                    />
                )}
                
                {activeSection === 'reviews' && (
                    <ReviewSection
                        reviews={reviews}
                        selectedReview={selectedReview}
                        newReview={newReview}
                        isWritingReview={isWritingReview}
                        isEditingReview={isEditingReview}
                        userIsAdmin={userIsAdmin}
                        onReviewClick={handleReviewClick}
                        onWriteReviewClick={handleWriteReviewClick}
                        onEditReviewClick={handleEditReviewClick}
                        onDeleteReview={handleDeleteReview}
                        onCancelReview={handleCancelReview}
                        onCreateReview={handleCreateReview}
                        onUpdateReview={handleUpdateReview}
                        setNewReview={setNewReview}
                        isLoggedIn={isLoggedIn}
                        getCurrentUser={getCurrentUser}
                    />
                )}
                
                {activeSection === 'contents' && (
                    <ContentSection lecture={lecture} />
                )}

                {activeSection === 'progress' && (
                    <ResourcesSection
                        resources={resources}
                        selectedResource={selectedResource}
                        isUploading={isUploading}
                        userIsAdmin={userIsAdmin}
                        onUploadClick={() => setIsUploading(true)}
                        onCancelUpload={() => {
                            setIsUploading(false);
                            setSelectedFile(null);
                        }}
                        onFileChange={setSelectedFile}
                        onUploadSubmit={handleUpload}
                        onResourceClick={setSelectedResource}
                        onDeleteResource={handleDelete}
                    />

                )}
            </div>
        </div>
    );
};

export default LectureDetail;
