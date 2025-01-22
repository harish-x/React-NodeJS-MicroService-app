import * as reviewService from '@review/services/review.service';
import { authUserPayload, reviewDocument, reviewMockRequest, reviewMockResponse } from '@review/controllers/test/mocks/review.mock';
import { review } from '@review/controllers/create';

jest.mock('@review/services/review.service');
jest.mock('@harish-x/jobber-helpers');
jest.mock('@review/queues/connection');
jest.mock('@elastic/elasticsearch');

describe('Review Controller', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('review method', () => {
    it('should return the correct response', async () => {
      const req = reviewMockRequest({}, reviewDocument, authUserPayload) ;
      const res = reviewMockResponse();
      jest.spyOn(reviewService, 'addReview').mockResolvedValue(reviewDocument);

      await review(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'Review created successfully.', review: reviewDocument });
    });
  });
});