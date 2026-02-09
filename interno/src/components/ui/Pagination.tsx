interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  totalPages,
  currentPage,
  onPageChange,
}: PaginationProps) {
  
  const getPages = () => {
    const pages: (number | string)[] = [];
    
    pages.push(1);
    
    if (currentPage > 3) {
      pages.push('...');
    }
    
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    
    for (let i = start; i <= end; i++) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }
    
    if (currentPage < totalPages - 2) {
      pages.push('...');
    }
    
    if (totalPages > 1 && !pages.includes(totalPages)) {
      pages.push(totalPages);
    }
    
    return pages;
  };
  
  const handlePageClick = (page: number | string) => {
    if (typeof page === 'number') {
      onPageChange(page);
    }
  };
  
  return (
    <div style={styles.container}>
      {getPages().map((page, index) => {
        if (page === '...') {
          return (
            <span key={`dots-${index}`} style={styles.dots}>
              ...
            </span>
          );
        }
        
        return (
          <button
            key={page}
            style={{
              ...styles.button,
              ...(page === currentPage ? styles.activeButton : {})
            }}
            onClick={() => handlePageClick(page)}
          >
            {page}
          </button>
        );
      })}
      
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    margin: '20px 0'
  },
  button: {
    width:'52px',
    height:'52px',
    border: '1px solid #CDA274',
    background: 'white',
    borderRadius: '50%',
    cursor: 'pointer',
    fontSize: '16px',
  },
  activeButton: {
    border: '1px solid #FFF',
    background: '#F4F0EC',
    color: '#292F36',
  },
  dots: {
    padding: '8px 4px',
    fontSize: '14px',
    color: '#292F36'
  }
};