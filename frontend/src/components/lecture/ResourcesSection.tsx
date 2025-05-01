import React from 'react';
import { Resource } from '../../utils/LectureDetailUtils';

interface ResourcesSectionProps {
    resources: Resource[];
    selectedResource: Resource | null;
    isUploading: boolean;
    userIsAdmin: boolean;
    onUploadClick: () => void;
    onCancelUpload: () => void;
    onFileChange: (file: File) => void;
    onUploadSubmit: () => void;
    onResourceClick: (resource: Resource | null) => void;
    onDeleteResource: (resourceId: number) => void;
}

const ResourcesSection: React.FC<ResourcesSectionProps> = ({
   resources,
   selectedResource,
   isUploading,
   userIsAdmin,
   onUploadClick,
   onCancelUpload,
   onFileChange,
   onUploadSubmit,
   onResourceClick,
   onDeleteResource,
}) => {
    return (
        <section id="lectureResources" className="resource-section">
            <div className="resource-header">
                <h2 className="section-title">📁 자료실</h2>
                {!isUploading && userIsAdmin && (
                    <button onClick={onUploadClick} className="resource-upload-btn">
                        파일 업로드
                    </button>
                )}
            </div>

            {isUploading ? (
                <div className="resource-form">
                    <h3>자료 업로드</h3>
                    <input type="file" onChange={(e) => e.target.files && onFileChange(e.target.files[0])} />
                    <div className="resource-form-buttons">
                        <button onClick={onCancelUpload} className="resource-cancel-btn">
                            취소
                        </button>
                        <button onClick={onUploadSubmit} className="resource-submit-btn">
                            업로드
                        </button>
                    </div>
                </div>
            ) : selectedResource ? (
                <div className="resource-detail">
                    <h3 className="resource-title">{selectedResource.fileName}</h3>
                    <p className="resource-meta">
                        <span>업로드일: {new Date(selectedResource.uploadedAt).toLocaleDateString()}</span>
                    </p>
                    <div className="resource-action-buttons">
                        <a
                            href={selectedResource.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="resource-download-btn"
                        >
                            다운로드
                        </a>
                        {userIsAdmin && (
                            <button
                                onClick={() => onDeleteResource(selectedResource.id)}
                                className="resource-delete-btn"
                            >
                                삭제
                            </button>
                        )}
                        <button onClick={() => onResourceClick(null)} className="resource-back-btn">
                            목록으로
                        </button>
                    </div>
                </div>
            ) : resources.length === 0 ? (
                <p className="resource-empty">등록된 자료가 없습니다. 첫 번째 자료를 업로드해보세요!</p>
            ) : (
                <table className="resource-table">
                    <thead>
                    <tr>
                        <th>번호</th>
                        <th>파일명</th>
                        <th>업로드일</th>
                    </tr>
                    </thead>
                    <tbody>
                    {resources.map((resource, index) => (
                        <tr
                            key={resource.id}
                            onClick={() => onResourceClick(resource)}
                            style={{ cursor: 'pointer' }}
                        >
                            <td>{resources.length - index}</td>
                            <td>{resource.fileName}</td>
                            <td>{new Date(resource.uploadedAt).toLocaleDateString()}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </section>
    );
};

export default ResourcesSection;
