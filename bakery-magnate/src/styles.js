import styled from 'styled-components';

export const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial;
`;

export const Section = styled.div`
  margin: 20px 0;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

export const DownloadSection = styled(Section)`
  background: #e8f5e8;
`;

export const TextArea = styled.textarea`
  width: 100%;
  height: 150px;
  margin: 10px 0;
`;

export const Button = styled.button`
  padding: 10px;
  margin: 5px;
  cursor: pointer;
`;

export const ToggleButton = styled(Button)`
  background: #6c757d;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 3px;
`;

export const ReturnButton = styled(Button)``;

export const Result = styled.div`
  margin: 10px 0;
  padding: 10px;
  background: #f5f5f5;
  border-left: 4px solid;

  &.in-stall {
    background: #d4edda;
    border-left-color: #28a745;
  }

  &.behind-window {
    background: #d1ecf1;
    border-left-color: #17a2b8;
  }

  &.in-shop-truck {
    background: #fff3cd;
    border-left-color: #ffc107;
  }

  &.in-own-truck {
    background: #f8d7da;
    border-left-color: #dc3545;
  }

  &.in-warehouse {
    background: #e2e3e5;
    border-left-color: #6c757d;
  }

  &.in-warehouse-cabinets {
    background: #d6d8db;
    border-left-color: #495057;
  }

  &.other {
    background: #f8f9fa;
    border-left-color: #6c757d;
  }
`;

export const ResultsContainer = styled.div`
  max-height: 400px;
  overflow-y: auto;
`;

export const Stats = styled.div`
  font-weight: bold;
  margin: 10px 0;
`;

export const FileInfo = styled.div`
  color: #666;
  font-style: italic;
  margin: 5px 0;
`;

export const Classification = styled.div`
  display: flex;
  gap: 10px;
  margin: 10px 0;
  flex-wrap: wrap;
`;

export const ClassBadge = styled.div`
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 14px;
  font-weight: bold;

  &.stall-badge {
    background: #d4edda;
    color: #155724;
  }

  &.window-badge {
    background: #d1ecf1;
    color: #0c5460;
  }

  &.shop-truck-badge {
    background: #fff3cd;
    color: #856404;
  }

  &.own-truck-badge {
    background: #f8d7da;
    color: #721c24;
  }

  &.warehouse-badge {
    background: #e2e3e5;
    color: #383d41;
  }

  &.warehouse-cabinets-badge {
    background: #d6d8db;
    color: #1b1e21;
  }

  &.other-badge {
    background: #f8f9fa;
    color: #383d41;
  }
`;

export const ResultOutput = styled(TextArea)`
  background-color: #f8f9fa;
  border: 1px solid #ced4da;
`;